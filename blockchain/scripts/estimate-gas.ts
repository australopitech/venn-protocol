import { ethers } from "ethers" ;

const FACTORY_ADDR = "0xee2bcf7220348Cd7cF89353c1E54f6fd7665B10A";
const OWNER_ADDR = "0xC8Ac1e295517782B40e65E450699E03C322Aa4E6";
const _ACCOUNT_ADDRESS = "0x94ef13fDEeA175B301b3C50BB755674fafcA7eC9";
const _ENTRY_POINT = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const _RPC = "https://polygon-mumbai.g.alchemy.com/v2/ZBTmQzxyfvrSOvDhspKMNLeB7dnXozv8";
const provider = new ethers.providers.JsonRpcProvider(_RPC)
const dummySig = "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";
const abi = [
    'function getNonce(address sender, uint192 key) view returns (uint256 nonce)'
]

const getNonce = async (account: `0x${string}`) => {
  const ep = new ethers.Contract(_ENTRY_POINT, abi, provider)
  return await ep.getNonce(account, 0);
}

const getInitCode = () => {
  const iface = new ethers.utils.Interface([
    'function createAccount(address owner,uint256 salt) returns (SmartAccount ret)'
  ]);
  return FACTORY_ADDR + iface.encodeFunctionData('createAccount', [
    OWNER_ADDR,
    0
  ]).slice(2)
}

const buildMockUO = async () => {
    return {
      sender: _ACCOUNT_ADDRESS,
      nonce: (await getNonce(_ACCOUNT_ADDRESS)).toHexString(),
      callData: "0x",
      initCode: getInitCode(),
      signature: dummySig,
      paymasterAndData: "0x"
    }
}

const estimateUserOpGas = async () => {
  const userOp = await buildMockUO();
  const gasData = await provider.send('eth_estimateUserOperationGas', [
    userOp,
    _ENTRY_POINT
  ]);

  const maxPriorityFeePerGas = await provider.send('rundler_maxPriorityFeePerGas', [])

  console.log(gasData)
    
}

const getFeeData = async () => {
  const feeData = await provider.getFeeData();
  console.log(feeData)
}

// getFeeData()

estimateUserOpGas().catch(err => {
    console.error(err)
    process.exitCode = 1
})