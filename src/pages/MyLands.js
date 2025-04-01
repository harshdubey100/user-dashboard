import React, { useState, useEffect, useCallback } from "react";
import { getContract } from "../services/contract";
import { ZeroAddress } from "ethers";
import "../pages/styles/MyLands.css"; // Import CSS

const MyLands = () => {
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyLands = useCallback(async () => {
        try {
            const { contract, signer } = await getContract();
            if (!signer) throw new Error("Signer is undefined. Please connect MetaMask.");

            const userAddress = await signer.getAddress();
            console.log("Fetching lands for:", userAddress);

            const ownedTokenIds = await contract.getLandsByOwner(userAddress);
            let myLands = [];

            for (let tokenId of ownedTokenIds) {
                try {
                    const landDetails = await contract.getLandDetails(tokenId);

                    myLands.push({
                        tokenId: tokenId.toString(),
                        ownerName: landDetails[0],
                        location: landDetails[1],
                        plotNumber: landDetails[2].toString(),
                        ownerAddress: landDetails[3],
                        metadataCID: landDetails[4],
                        approvedBuyer: landDetails[5]
                    });
                } catch (error) {
                    console.error(`Error fetching details for token ${tokenId}:`, error);
                }
            }

            setLands(myLands);
        } catch (error) {
            console.error("Error fetching lands:", error);
            alert(`Error: ${error.message}`);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchMyLands();
    }, [fetchMyLands]);

    return (
        <div className="my-lands-container">
            <h1>My Lands</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="lands-grid">
                    {lands.length === 0 ? (
                        <p>No lands found.</p>
                    ) : (
                        lands.map((land) => (
                            <div key={land.tokenId} className="land-card">
                                <h3>Token ID #{land.tokenId}</h3>
                                <p><strong>Plot No:</strong> {land.plotNumber}</p>
                                <p><strong>Owner:</strong> {land.ownerName} ({land.ownerAddress})</p>
                                <p><strong>Location:</strong> {land.location}</p>
                                <p>
                                    <strong>Metadata:</strong> <a href={`https://ipfs.io/ipfs/${land.metadataCID}`} target="_blank" rel="noopener noreferrer">
                                        View Metadata
                                    </a>
                                </p>
                                {land.approvedBuyer !== ZeroAddress && land.approvedBuyer !== "0x0000000000000000000000000000000000000000" && (
                                    <p className="sale-info">Pending Sale to: {land.approvedBuyer}</p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default MyLands;
