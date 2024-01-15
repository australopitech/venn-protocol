'use client'
import React, { useEffect, useState } from 'react';
import styles from './dialog-not-owned-borrowed-description.module.css';
// import { useBlockMeta, useEthers } from '@usedapp/core';
import { NftItem } from '@/types/typesNftApi.d';
import walletabi from '../../../utils/contractData/RWallet.artifact.json';
import { receiptsContract } from '@/utils/contractData';
// import { BigNumber, ethers } from 'ethers';
import { useTimestamp } from '@/hooks/block-data';
import { getNFTByReceipt, ownerOf } from '@/utils/utils';
import { getAddress, GetBlockReturnType } from 'viem';
import { useAccount, useBlockNumber, usePublicClient } from 'wagmi';
import { baseGoerli } from 'viem/chains';
// import { client } from '@/pages/client';

export interface DialogNotOwnedBorrowedDescriptionProps {
  address?: `0x${string}`;
  nftItem?: NftItem;
  isRental?: boolean;
}

const dayCutOff = 82800; // 23 h;
const hourCutOff = 3540 // 59 min;

async function getEndTime(
  client: any, 
  account?: `0x${string}`, 
  nftItem?: NftItem,
  ) {
  if(!account || !nftItem) return
  if(!nftItem.nftData.token_id) {
    console.error('no token id found');
    return
  }
  let contractAddr: string;
  let tokenId: bigint;
  let acc: `0x${string}`;
  if(getAddress(nftItem.contractAddress) === receiptsContract.address) {
    const nftObj = await getNFTByReceipt(
      client,
      BigInt(nftItem.nftData.token_id)
    );
    contractAddr = nftObj.contractAddress;
    tokenId = nftObj.tokenId;
    acc = await ownerOf(client, contractAddr, tokenId);
  } else {
    contractAddr = nftItem.contractAddress;
    tokenId = BigInt(nftItem.nftData.token_id);
    acc = account;
  }
  // const wallet = new ethers.Contract(acc, walletabi.abi, client );
  // const rentals = await wallet.getRentals();
  const rentals = await client.readContract({
    address: acc,
    abi: walletabi.abi,
    functionName: 'getRentals',
  }) as any[];
  // const index = await wallet.getTokenIndex(contractAddr, tokenId);
  const index = await client.readContract({
    address: acc,
    abi: walletabi.abi,
    functionName: 'getTokenIndex',
    args: [contractAddr, tokenId]
  }) as any;
  console.log('tokenIndex', index);
  console.log('rental', rentals[index]);
  if(rentals) return rentals[index].endTime;
}

export const DialogNotOwnedBorrowedDescription = ({ 
  address,
  nftItem,
  isRental
}: DialogNotOwnedBorrowedDescriptionProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [block, setBlock] = useState<GetBlockReturnType>();
  // const { account, library, chainId } = useEthers();
  // const client = usePublicClient();
  const { address: account} = useAccount();
  // const timestamp = useTimestamp({ chainId: chainId, isStatic: false, refresh: 5});
  // const { data: block } = useBlock();
  const { data: blockNum, error: blockErr } = useBlockNumber({ watch: true });
  const client = usePublicClient({
    chainId: baseGoerli.id
  });
  // console.log('timestamp', timestamp, typeof timestamp);
  
  useEffect(() => {
    const resolveBlock = async () => {
      setBlock(await client.getBlock());
    }
    resolveBlock();
  }, [blockNum, client]);

  useEffect(() => {
    const resolveTimeLeft = async() => {
      const addr = address ?? account;
      // console.log('addr', addr)
      const endTime = await getEndTime(client, addr, nftItem);
      console.log('endTime', endTime?.toString());
      const timestamp = block?.timestamp;
      if(endTime && timestamp) setTimeLeft(endTime.sub(timestamp).toNumber())
    }

    resolveTimeLeft();
    console.log('timeLeft', timeLeft)
  }, [block, client]);

  return (
    <div className={styles.bodyDescriptionContainer}>
      <div className={styles.divider}></div>
      <div className={styles.bodyDescription}>
        {timeLeft > 0 &&
          <>
          <span>
          This NFT is {isRental? "rented by you" : "rented"}. The rent <span className={styles.textHilight}>expires in</span>
          </span>
          <span className={styles.timeLeftValue}> 
            {timeLeft >= dayCutOff
              ? `${parseFloat(String(timeLeft/86400)).toFixed(1)} ${timeLeft/86400 <= 2 ? 'day' : 'days'}`
              : timeLeft >= hourCutOff
                ? `${parseFloat(String(timeLeft/3600)).toFixed(1)} ${timeLeft/3600 <= 2 ? 'hour' : 'hours'}`
                : timeLeft >= 60
                  ? `${parseFloat(String(timeLeft/60)).toFixed(1)} ${timeLeft <= 120 ? 'minute' : 'minutes' }`
                  : 'less than a minute'
            } 
          </span></>
        }
        {timeLeft <= 0 &&
          <>
          <span>
          This NFT is {isRental? 'rented by you' : 'rented'}.<br></br> The rent <span className={styles.textHilight}>is expired.</span>
          </span>
          </>
        }
        {/** holder === signer.address &&
         *  <`Release NFT` button /> */}
      </div>
    </div>
  );
};
