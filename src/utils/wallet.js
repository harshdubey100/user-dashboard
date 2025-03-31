import { ethers } from "ethers";

export const connectWallet = async () => {
    if (!window.ethereum) {
        alert("No Ethereum wallet found!");
        return null;
    }

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = provider.getSigner();
        const account = await signer.getAddress();
        return { provider, signer, account };
    } catch (error) {
        console.error("Wallet connection failed:", error);
        return null;
    }
};
