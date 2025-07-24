import Link from "next/link";
import styles from "@/styles/PropertyCard.module.css";

export default function PropertyCard({ property }) {
  return (
    <div className={styles.card}>
      <img src={property.image} alt={property.title} />
      <div className={styles.content}>
        <h3>{property.title}</h3>
        <p className={styles.location}>{property.location}</p>
        <p className={styles.price}>{property.price} ETH / night</p>
        <Link href={`/property/${property.id}`} className={styles.button}>
          View Details
        </Link>
      </div>
    </div>
  );
}
