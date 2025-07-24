import { useState } from "react";
import Navbar from "@/components/Navbar";
import { ethers } from "ethers";
import { getContract } from "@/utils/getContract";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const router = useRouter();

  // Dummy properties
  const dummyProperties = [
    {
      id: 1,
      title: "Luxury Villa",
      location: "California, USA",
      description: "A beautiful luxury villa with ocean views.",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
      price: "1.5",
    },
    {
      id: 2,
      title: "Modern Apartment",
      location: "Berlin, Germany",
      description: "Stylish apartment in the heart of the city.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      price: "0.8",
    },
    {
      id: 3,
      title: "Cozy Beach House",
      location: "Bali, Indonesia",
      description: "Relax by the beach in this cozy house.",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      price: "2.0",
    },
  ];

  const [loadingId, setLoadingId] = useState(null);

  // ✅ Booking function
  const handleBooking = async (property) => {
    if (!window.ethereum) {
      alert("MetaMask not detected!");
      return;
    }

    try {
      setLoadingId(property.id);

      const contract = await getContract();
      if (!contract) return;

      // For demo: 1-day booking
      const now = Math.floor(Date.now() / 1000);
      const startDate = now + 24 * 60 * 60; // tomorrow
      const endDate = startDate + 24 * 60 * 60; // +1 night

      const tx = await contract.bookProperty(
        property.id,
        startDate,
        endDate,
        {
          value: ethers.parseEther(property.price), // send ETH payment
        }
      );

      await tx.wait();

      alert(`✅ Successfully booked ${property.title}!`);
      router.push("/bookings"); // redirect to MyBookings page
    } catch (err) {
      console.error("Booking failed:", err);
      alert("❌ Booking failed!");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h1>🏡 Welcome to StayChain</h1>
        <p>Browse and book amazing properties on the blockchain.</p>

        <h2>✨ Featured Properties</h2>
        <div className={styles.grid}>
          {dummyProperties.map((property) => (
            <div key={property.id} className={styles.card}>
              <img src={property.image} alt={property.title} />
              <h3>{property.title}</h3>
              <p>📍 {property.location}</p>
              <p>{property.description}</p>
              <p>💰 {property.price} ETH / night</p>

              <button
                onClick={() => handleBooking(property)}
                disabled={loadingId === property.id}
                className={styles.bookBtn}
              >
                {loadingId === property.id ? "⏳ Processing..." : "Book Now"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
