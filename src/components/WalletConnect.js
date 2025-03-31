import React, { useState } from "react";
import { connectWallet } from "../utils/wallet";

const WalletConnect = () => {
    const [account, setAccount] = useState("");

    const handleConnect = async () => {
        const wallet = await connectWallet();
        if (wallet) setAccount(wallet.account);
    };

    return (
        <div>
            <button onClick={handleConnect}>
                {account ? `Connected: ${account.substring(0, 6)}...` : "Connect Wallet"}
            </button>
        </div>
    );
};

export default WalletConnect;
