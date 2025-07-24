import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/styles/Navbar.module.css";

export default function Navbar() {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  // Detect account change
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>StayChain</div>

      <div className={styles.links}>
        <Link href="/">Home</Link>
        <Link href="/list">List Property</Link>
        <Link href="/bookings">My Bookings</Link>
      </div>

      <div className={styles.wallet}>
        {account ? (
          <span className={styles.connected}>
            ✅ {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        ) : (
          <button onClick={connectWallet} className={styles.connectBtn}>
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}
