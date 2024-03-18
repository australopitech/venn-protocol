// import { createPublicClient, http, Chain, parseAbi, encodeFunctionData, WalletClient } from "viem"
// import { polygonMumbai } from "viem/chains";
// import { EntryPointAbi } from "@alchemy/aa-core";
import { ethers } from "ethers";
// import { UserOperationStruct } from "@alchemy/aa-core";

const ENTRY_POINT = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const RPC = "https://polygon-mumbai.g.alchemy.com/v2/ZBTmQzxyfvrSOvDhspKMNLeB7dnXozv8";
const FACTORY_ADDRESS = "";
// const chain = polygonMumbai;
// const client = createPublicClient({ chain, transport: http(RPC) });
const provider = new ethers.providers.JsonRpcProvider(RPC);
const dummySig = "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";


export const getInitCode = (
    owner: `0x${string}`,
    salt: bigint
) => {
  const iface = new ethers.utils.Interface([
    'function createAccount(address owner,uint256 salt) returns (SmartAccount ret)'
  ]);
  return FACTORY_ADDRESS + iface.encodeFunctionData('createAccount', [
    owner,
    salt
  ]).slice(2);
}

export const depositToEntryPoint = async (
    signer: WalletClient,
    value: bigint,
    beneficiary: `0x${string}`
) => {
  const account = await signer.getAddresses();
  const { request } = await client.simulateContract({
    account: account[0],
    address: ENTRY_POINT,
    abi: EntryPointAbi,
    functionName: 'depositTo',
    args: [beneficiary]
  });
  return await signer.writeContract(request);
}

export const getNonce = async (
    address: `0x${string}`
) => {
  const abi = parseAbi([
    'function getNonce(address sender, uint192 key) view returns (uint256 nonce)'
  ]);
  return await client.readContract({
    address: ENTRY_POINT,
    abi,
    functionName: 'getNonce',
    args: [address, 0n]
  });
}

export const getUserOpCalldata = (
    target: `0x${string}`,
    value: bigint,
    callData: `0x${string}`
) => {
  const abi = parseAbi([
    'function execute(address dest, uint256 value, bytes calldata func)'
  ]);
  return encodeFunctionData({
    abi,
    functionName: 'execute',
    args: [
        target,
        value,
        callData
    ]
  });  
}

export const getEstimatedUserOpGas = async (
    userOp: any,
) => {
  return await provider.send('eth_estimateUserOperationGas', [
    userOp,
    _ENTRY_POINT
  ]);  
}

export const buildUnsignedUserOp = async (
  sender: `0x${string}`,
  target: `0x${string}`,
  value: bigint,
  callData?: any,
  initCode?: any,
): Promise<UserOperationStruct> => {
  let userOp: UserOperationStruct = {
    sender,
    nonce: `0x${(await getNonce(sender)).toString(16)}`,
    callData: getUserOpCalldata(target, value, callData ?? '0x'),
    initCode: initCode ?? '0x',
    signature: dummySig,
    paymasterAndData: '0x'
  }

  const { preVerificationGas, verificationGasLimit, callGasLimit } = await getEstimatedUserOpGas(userOp);

  const { maxFeePerGas } = await provider.getFeeData();
  const maxPriorityFeePerGas = await provider.send('rundler_maxPriorityFeePerGas', [])

  userOp = {
    ...userOp,
    preVerificationGas,
    verificationGasLimit,
    callGasLimit,
    maxFeePerGas: maxFeePerGas ?? undefined,
    maxPriorityFeePerGas
  }

  return userOp;
}

export const signUserOp = async (
  userOp: any,
  signer: any
) => {
  const account = userOp.sender;
  const userOpHash = await client.readContract({
    address: ENTRY_POINT,
    abi: EntryPointAbi,
    functionName: 'getUserOpHash',
    args: [userOp]
  })
  userOp.signature = await signer.signMessage({
    account,
    userOpHash   
  });
  return userOp;
}

export const sendUserOp = async (
  signer: any,
  sender: `0x${string}`,
  target: `0x${string}`,
  value: bigint,
  callData?: any,
) => {
  let initCode;
  const [signerAddr] = await signer.getAddresses()
  const code = await provider.getCode(sender);
  if(code.length !== 0) {
    initCode = getInitCode(signerAddr, 0n);
  }

  const unsignedUserOp = buildUnsignedUserOp(
    sender,
    target,
    value,
    callData,
    initCode
  );

  const userOp = await signUserOp(
    unsignedUserOp,
    signer
  )

  return await provider.send('eth_sendUserOperation', [
    userOp,
    ENTRY_POINT
  ]);
}