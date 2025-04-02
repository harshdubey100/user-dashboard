import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getContract } from "../services/contract"; // Assuming you have a contract service to get the contract instance
import "./styles/LandsSale.css";
const LandSale = () => {
  const [lands, setLands] = useState([]);
  const [buyerAddress, setBuyerAddress] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // Fetch user's owned lands and their sale status
  const fetchLands = async () => {
    try {
      const { contract, signer } = await getContract();
      if (!signer) throw new Error("Signer is undefined. Please connect MetaMask.");
  
      const userAddress = await signer.getAddress();
      const ownedTokenIds = await contract.getLandsByOwner(userAddress);
  
      const userLands = [];
      for (let tokenId of ownedTokenIds) {
        const landDetails = await contract.getLandDetails(tokenId);
        const approvedBuyer = landDetails[5]; // `approvedBuyer` is the 6th value returned
        const isForSale = approvedBuyer !== ethers.ZeroAddress && approvedBuyer !== "0x0000000000000000000000000000000000000000";
  
        userLands.push({
          tokenId: tokenId.toString(),
          location: landDetails[1],
          isForSale,
        });
      }
      setLands(userLands);
    } catch (error) {
      console.error("Error fetching lands:", error);
      setStatusMessage("Error fetching lands.");
    }
  };
  

  useEffect(() => {
    fetchLands();
  }, []);

  const handleInitiateSale = async (tokenId) => {
    if (!tokenId) {
      setStatusMessage("Please select a land to sell.");
      return;
    }

    try {
      const { contract, signer } = await getContract();
      if (!signer) throw new Error("Signer is undefined. Please connect MetaMask.");

      if (!ethers.isAddress(buyerAddress)) {
        setStatusMessage("Invalid buyer address.");
        return;
      }

      setStatusMessage("Initiating sale...");

      const tx = await contract.sell(tokenId, buyerAddress);
      await tx.wait();

      setStatusMessage(`Sale initiated successfully! Buyer: ${buyerAddress}`);

      fetchLands(); // Refresh the land list to update sale status
    } catch (error) {
      setStatusMessage("Error initiating sale.");
      console.error(error);
    }
  };

  const handleCancelSale = async (tokenId) => {
    try {
      const { contract, signer } = await getContract();
      if (!signer) throw new Error("Signer is undefined. Please connect MetaMask.");

      setStatusMessage("Canceling sale...");

      const tx = await contract.cancelSale(tokenId);
      await tx.wait();

      setStatusMessage("Sale canceled successfully.");
      fetchLands(); // Refresh the land list to update sale status
    } catch (error) {
      setStatusMessage("Error canceling sale.");
      console.error(error);
    }
  };

  return (
    <div className="land-sale-section-container">
            <h3 className="land-sale-section-title">Land Sale Management</h3>

            <ul className="land-sale-section-list">
                {lands.map((land) => (
                    <li key={land.tokenId} className="land-sale-section-item">
                        <span className="land-sale-section-location">
                            {land.location} (Token ID: {land.tokenId})
                        </span>
                        {land.isForSale ? (
                            <span className="land-sale-section-sale-info">
                                - Land with NFT ID {land.tokenId} is initiated for sale.
                                <button
                                    className="land-sale-section-cancel-btn"
                                    onClick={() => handleCancelSale(land.tokenId)}
                                >
                                    Cancel Sale
                                </button>
                            </span>
                        ) : (
                            <div className="land-sale-section-sale-input">
                                <input
                                    type="text"
                                    value={buyerAddress}
                                    onChange={(e) => setBuyerAddress(e.target.value)}
                                    placeholder="Enter buyer address"
                                    className="land-sale-section-input"
                                />
                                <button
                                    className="land-sale-section-initiate-btn"
                                    onClick={() => handleInitiateSale(land.tokenId)}
                                >
                                    Initiate Sale
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {/* Status Message */}
            {statusMessage && <p className="land-sale-section-status">{statusMessage}</p>}
        </div>
  );
};

export default LandSale;