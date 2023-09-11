import Image from 'next/image'
import { Inter } from 'next/font/google'

import { ethers } from 'ethers';
import React, {useState, useEffect} from 'react';
import { useEthers, useEtherBalance, useConfig, useSigner } from '@usedapp/core';
import { fetchAddressData } from '../utils/frontendUtils'
import send from '../utils/call/send';
import { isApproved, isListed } from '@/utils/utils';
import { approve, list, delist, pull, rent } from '../utils/call';
import nft from '../utils/contractData/NFT.json';
import mktPlace from '../utils/contractData/MarketPlace.json';

const inter = Inter({ subsets: ['latin'] })

const ConnectButton = () => {
  const { account, deactivate, activateBrowserWallet } = useEthers()
  // 'account' being undefined means that we are not connected.
  if (account) return <button onClick={() => deactivate()}>Disconnect</button>
  else return <button onClick={() => activateBrowserWallet()}>Connect</button>
}

var dataFetched : boolean = false;

export default function Home() {
  const provider = new ethers.providers.JsonRpcProvider('https://base-goerli.gateway.tenderly.co/6jlPleyGSLqQIAsz1uTkSg');
  const signer = useSigner();
  const config = useConfig();
  const [listed, setListed] = useState<boolean>();
  const [listIsLoading, setlistIsLoading] = useState<boolean>();
  
  if(!config.readOnlyUrls) throw new Error('network config error');
  const { account, chainId } = useEthers();
  const etherBalance = useEtherBalance(account);
  if (chainId && !config.readOnlyUrls[chainId]) {
    return <p>Please use Base Goerli testnet.</p>
  }

  const tokenId = 0;
  // console.log(signer)
  

  if (!dataFetched && process.env.NEXT_PUBLIC_EXAMPLE_ADDRESS) {
    // fetchNFTData('base-mainnet', process.env.NEXT_PUBLIC_EXAMPLE_ADDRESS)
    fetchAddressData('eth-mainnet', process.env.NEXT_PUBLIC_EXAMPLE_ADDRESS)
    .then( data => {
      dataFetched = true;
      console.log(data);
    });
  }
  
  const sendHandler = async () => {
    const value = 0.000085;
    // const to = "0x099A294Bffb99Cb2350A6b6cA802712D9C96676A";
    const to = "0x49e75CB7Ff22F1B4E41f382cA4B5e6D349dDDc36";
    await send(signer, value, to);
  }

  const listHandler = async () => {
    if(!signer) { 
      alert('connect a wallet');
      return;
    }
    if(listIsLoading) return
    
    const price = 100;
    const maxDuration = 10000;
    
    setlistIsLoading(true);
    const tokenOwner = await signer.getAddress();
    const appr = await isApproved(provider, nft.address, tokenId, tokenOwner, mktPlace.address);
    if(!appr) await approve(signer, nft.address, tokenId, mktPlace.address);
    await list(signer, nft.address, tokenId, price, maxDuration);
    setlistIsLoading(false)
  }

  useEffect(() => {
    isListed(provider, nft.address, tokenId).then((r) => setListed(r));
  }, [listIsLoading, signer]);

  return (
    
    <div>
      <div>
      <ConnectButton />
      <div className='py-4'> <button className='py-2 px-4 bg-green-500 rounded' onClick={sendHandler}>send</button></div>
      </div>
      {etherBalance && (
        <div className="balance">
          <br />
          Address:
          <p className="bold">{account}</p>
          <br />
          Balance:
          <p className="bold">{ethers.utils.formatEther(etherBalance)}</p>
        </div>
      )}
      <div className='px-2 py-4'>
        <button className='py-2 px-4 bg-blue-800' onClick={listHandler}>
          {listIsLoading? 'loading...' : 'List token 0'}
        </button>
        <p className='p-4'>{listed && "token Listed!"}</p>
      </div>
    </div>
    // <main
    //   className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    // >
    //   <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
    //     <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
    //       Get started by editing&nbsp;
    //       <code className="font-mono font-bold">pages/index.tsx</code>
    //     </p>
    //     <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
    //       <a
    //         className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
    //         href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         By{' '}
    //         <Image
    //           src="/vercel.svg"
    //           alt="Vercel Logo"
    //           className="dark:invert"
    //           width={100}
    //           height={24}
    //           priority
    //         />
    //       </a>
    //     </div>
    //   </div>

    //   <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
    //     <Image
    //       className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
    //       src="/next.svg"
    //       alt="Next.js Logo"
    //       width={180}
    //       height={37}
    //       priority
    //     />
    //   </div>

    //   <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
    //     <a
    //       href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
    //       className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <h2 className={`mb-3 text-2xl font-semibold`}>
    //         Docs{' '}
    //         <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
    //           -&gt;
    //         </span>
    //       </h2>
    //       <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
    //         Find in-depth information about Next.js features and API.
    //       </p>
    //     </a>

    //     <a
    //       href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
    //       className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <h2 className={`mb-3 text-2xl font-semibold`}>
    //         Learn{' '}
    //         <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
    //           -&gt;
    //         </span>
    //       </h2>
    //       <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
    //         Learn about Next.js in an interactive course with&nbsp;quizzes!
    //       </p>
    //     </a>

    //     <a
    //       href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
    //       className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <h2 className={`mb-3 text-2xl font-semibold`}>
    //         Templates{' '}
    //         <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
    //           -&gt;
    //         </span>
    //       </h2>
    //       <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
    //         Discover and deploy boilerplate example Next.js&nbsp;projects.
    //       </p>
    //     </a>

    //     <a
    //       href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
    //       className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <h2 className={`mb-3 text-2xl font-semibold`}>
    //         Deploy{' '}
    //         <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
    //           -&gt;
    //         </span>
    //       </h2>
    //       <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
    //         Instantly deploy your Next.js site to a shareable URL with Vercel.
    //       </p>
    //     </a>
    //   </div>
    // </main>
  )
}
