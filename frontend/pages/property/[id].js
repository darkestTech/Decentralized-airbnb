import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContract } from "@/utils/getContract";
import styles from "@/styles/PropertyDetails.module.css";

export default function PropertyDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState(null);

  const fetchProperty = async () => {
    if (!id) return;

    const contract = await getContract();
    const prop = await contract.properties(id);

    setProperty({
      id,
      title: prop.title,
      location: prop.location,
      image: prop.imageURL,
      price: ethers.formatEther(prop.price),
      isBooked: prop.isBooked,
    });
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const bookProperty = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.bookProperty(property.id, {
        value: ethers.parseEther(property.price),
      });
      await tx.wait();
      alert("✅ Booking successful!");
      fetchProperty();
    } catch (err) {
      console.error(err);
      alert("❌ Booking failed!");
    }
  };

  if (!property) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className={styles.heroImage}>
        <img src={property.image} alt={property.title} />
      </div>

      <div className={styles.container}>
        <div className={styles.details}>
          <h1>{property.title}</h1>
          <p>📍 {property.location}</p>
          <p>{property.price} ETH / night</p>
          <p>Status: {property.isBooked ? "🔴 Booked" : "🟢 Available"}</p>

          {!property.isBooked && (
            <button onClick={bookProperty} className={styles.bookButton}>
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
