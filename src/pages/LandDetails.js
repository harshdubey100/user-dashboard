// src/pages/LandDetails.js
import { ethers } from "ethers";

import React, { useState } from "react";
import { getContract } from "../services/contract";

const LandDetails = () => {
    const [tokenId, setTokenId] = useState("");
    const [landDetails, setLandDetails] = useState(null);
    const [error, setError] = useState("");

    const fetchLandDetails = async () => {
        try {
            setError("");
            const { contract } = await getContract(); // Extract contract from the returned object
            const details = await contract.getLandDetails(parseInt(tokenId));
            
            setLandDetails({
                ownerName: details[0],
                location: details[1],
                plotNumber: details[2].toString(),
                owner: details[3],
                ipfsCID: details[4],
                approvedBuyer: details[5] !== ethers.ZeroAddress ? details[5] : "None"
            });
        } catch (err) {
            console.error(err);
            setError("Error fetching land details. Make sure the Token ID is correct.");
        }
    };

    return (
        <div>
            <h1>Land Details</h1>
            <p>see any land by token/NFT id</p>
            <input
                type="number"
                placeholder="Enter Token ID"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
            />
            <button onClick={fetchLandDetails}>Fetch Details</button>
            
            {error && <p style={{ color: "red" }}>{error}</p>}
            {landDetails && (
                <div>
                    <h3>Land Information</h3>
                    <p><strong>Owner Name:</strong> {landDetails.ownerName}</p>
                    <p><strong>Location:</strong> {landDetails.location}</p>
                    <p><strong>Plot Number:</strong> {landDetails.plotNumber}</p>
                    <p><strong>Owner Address:</strong> {landDetails.owner}</p>
                    <p><strong>IPFS CID:</strong> {landDetails.ipfsCID}</p>
                    <p><strong>Approved Buyer:</strong> {landDetails.approvedBuyer}</p>
                </div>
            )}
        </div>
    );
};

export default LandDetails;