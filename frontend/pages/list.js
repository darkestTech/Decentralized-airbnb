import Navbar from "@/components/Navbar";
import { useState } from "react";
import styles from "@/styles/ListProperty.module.css";

export default function ListProperty() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !location || !price || !image || !description) {
      alert("⚠️ Please fill all fields!");
      return;
    }

    alert(`✅ Property listed!\n\nTitle: ${title}\nLocation: ${location}\nPrice: ${price} ETH`);

    setTitle("");
    setLocation("");
    setPrice("");
    setImage("");
    setDescription("");
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.heading}>📌 List a New Property</h1>

        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              placeholder="🏠 Property Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
            />
            <input
              type="text"
              placeholder="📍 Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={styles.input}
            />
            <input
              type="number"
              placeholder="💰 Price per night (ETH)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={styles.input}
            />
            <input
              type="text"
              placeholder="🖼️ Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className={styles.input}
            />
            <textarea
              placeholder="📝 Property Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
            />
            <button type="submit" className={styles.button}>
              ✅ List Property
            </button>
          </form>
        </div>

        
        <h2 className={styles.subHeading}>✨ Sample Properties</h2>
        <div className={styles.sampleGrid}>
          {sampleProperties.map((prop, index) => (
            <div key={index} className={styles.sampleCard}>
              <img src={prop.image} alt={prop.title} className={styles.sampleImage} />
              <div className={styles.sampleContent}>
                <h3>{prop.title}</h3>
                <p>📍 {prop.location}</p>
                <p>{prop.description}</p>
                <p className={styles.samplePrice}>💰 {prop.price} ETH / night</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const sampleProperties = [
  {
    title: "Cozy Beach House",
    location: "California, USA",
    description: "Enjoy relaxing ocean views in this modern beach house.",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800",
    price: "1.2",
  },
  {
    title: "Modern City Apartment",
    location: "Berlin, Germany",
    description: "A stylish apartment in the heart of the city.",
    image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800",
    price: "0.9",
  },
  {
    title: "Luxury Mountain Cabin",
    location: "Aspen, Colorado",
    description: "Escape to a peaceful mountain retreat.",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
    price: "2.5",
  },
  {
    title: "Tropical Villa",
    location: "Bali, Indonesia",
    description: "Private pool and serene tropical vibes.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    price: "3.1",
  },
];
