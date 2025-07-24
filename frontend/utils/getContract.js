import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants/contract";

export const getContract = async () => {
  if (!window.ethereum) {
    alert("MetaMask not detected!");
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);

  // ✅ DO NOT call eth_requestAccounts again here
  const signer = await provider.getSigner(); 
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};
