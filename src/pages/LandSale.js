import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getContract } from "../services/contract"; // Assuming you have a contract service to get the contract instance

const LandSale = () => {
  const [lands, setLands] = useState([]);
  const [selectedTokenId, setSelectedTokenId] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaleInProgress, setIsSaleInProgress] = useState(false);

  // Fetch user's owned lands
  const fetchLands = async () => {
    try {
      const { contract, signer } = await getContract();
      if (!signer) throw new Error("Signer is undefined. Please connect MetaMask.");

      const userAddress = await signer.getAddress();
      const ownedTokenIds = await contract.getLandsByOwner(userAddress);
      
      const userLands = [];
      for (let tokenId of ownedTokenIds) {
        const landDetails = await contract.getLandDetails(tokenId);
        userLands.push({
          tokenId: tokenId.toString(),
          location: landDetails[1],
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

  const handleInitiateSale = async () => {
    if (!selectedTokenId) {
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

      const tx = await contract.sell(selectedTokenId, buyerAddress);
      await tx.wait();

      setStatusMessage(`Sale initiated successfully! Buyer: ${buyerAddress}`);
      setIsSaleInProgress(true);
    } catch (error) {
      setStatusMessage("Error initiating sale.");
      console.error(error);
    }
  };

  const handleCancelSale = async () => {
    if (!selectedTokenId) {
      setStatusMessage("Please select a land to cancel the sale.");
      return;
    }

    try {
      const { contract, signer } = await getContract();
      if (!signer) throw new Error("Signer is undefined. Please connect MetaMask.");

      setStatusMessage("Canceling sale...");

      const tx = await contract.cancelSale(selectedTokenId);
      await tx.wait();

      setStatusMessage("Sale canceled successfully.");
      setIsSaleInProgress(false);
    } catch (error) {
      setStatusMessage("Error canceling sale.");
      console.error(error);
    }
  };

  return (
    <div className="land-sale-container">
      <h3>Land Sale Management</h3>
      
      {/* Land Selection Dropdown */}
      <div>
        <label>Select Land to Sell:</label>
        <select
          value={selectedTokenId}
          onChange={(e) => setSelectedTokenId(e.target.value)}
        >
          <option value="">-- Select Land --</option>
          {lands.map((land) => (
            <option key={land.tokenId} value={land.tokenId}>
              {land.location} (Token ID: {land.tokenId})
            </option>
          ))}
        </select>
      </div>

      {/* Buyer Address Input */}
      <div>
        <input
          type="text"
          value={buyerAddress}
          onChange={(e) => setBuyerAddress(e.target.value)}
          placeholder="Enter buyer address"
        />
      </div>

      {/* Sale Control Buttons */}
      {isSaleInProgress ? (
        <div>
          <p>Land is listed for sale.</p>
          <button onClick={handleCancelSale}>Cancel Sale</button>
        </div>
      ) : (
        <div>
          <button onClick={handleInitiateSale}>Initiate Sale</button>
        </div>
      )}

      {/* Status Message */}
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default LandSale;
