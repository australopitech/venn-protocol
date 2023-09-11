import { ethers } from "ethers";

const send =  async (signer: any | undefined, value: number, to: string) => {
    if(!signer) {
        console.log('signer undefined');
        alert('Connect your wallet');
        return
    }
    let error = null;
    let receipt;
    try {
        const tx = await signer.sendTransaction({
            to: to, 
            value: ethers.utils.parseEther(value.toString())
        });
        receipt = await tx.wait();
        console.log(receipt);
    } catch (err) {
        error = err;
        console.log(err);
    }
    if(error == null) {
        console.log('success');
        console.log('tx hash', receipt?.transactionHash);
        alert(`transfer was successfull!`);
    }

}

export default send;