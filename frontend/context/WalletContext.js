import { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";

export const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);

  // ✅ On load, check if wallet already connected
  useEffect(() => {
    if (window.ethereum) {
      checkIfWalletIsConnected();
    }
  }, []);

  // ✅ Check existing connection WITHOUT triggering a popup
  const checkIfWalletIsConnected = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_accounts", []); // does NOT request
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error("Wallet check failed:", error);
    }
  };

  // ✅ Connect wallet ONLY when user clicks button
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      // ✅ First check if already connected
      const existingAccounts = await provider.send("eth_accounts", []);
      if (existingAccounts.length > 0) {
        setAccount(existingAccounts[0]);
        return;
      }

      // ✅ If not connected → request connection
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  return (
    <WalletContext.Provider value={{ account, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
}
