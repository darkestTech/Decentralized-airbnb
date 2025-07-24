import Navbar from "@/components/Navbar";
import styles from "@/styles/Properties.module.css"; 

export default function MyBookings() {
  // ✅ Dummy bookings for now
  const myBookings = [
    {
      id: 1,
      title: "Cozy Beach House",
      location: "California, USA",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
      date: "2025-07-21",
      price: "1.2 ETH",
    },
    {
      id: 2,
      title: "Modern Apartment",
      location: "Berlin, Germany",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      date: "2025-07-25",
      price: "0.8 ETH",
    },
    {
      id: 3,
      title: "Luxury Villa",
      location: "Bali, Indonesia",
      image:
        "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=800&q=80",
      date: "2025-08-02",
      price: "3.0 ETH",
    },
  ];

  return (
    <div>
      <Navbar />

      <div className={styles.container}>
        <h1 className={styles.heading}>📖 My Bookings</h1>

        <div className={styles.grid}>
          {myBookings.map((booking) => (
            <div key={booking.id} className={styles.card}>
              <img
                src={booking.image}
                alt={booking.title}
                className={styles.cardImage}
              />
              <div className={styles.cardContent}>
                <h2>{booking.title}</h2>
                <p>📍 {booking.location}</p>
                <p>📅 {booking.date}</p>
                <p className={styles.price}>💰 {booking.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
