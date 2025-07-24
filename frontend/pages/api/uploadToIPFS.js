import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { title, location, image, description, price } = req.body;

  const PINATA_JWT = process.env.PINATA_JWT; // JWT from Pinata

  if (!PINATA_JWT) {
    return res.status(500).json({ error: "Missing PINATA_JWT" });
  }

  try {
    // Metadata JSON
    const metadata = {
      name: title,
      description,
      image,
      attributes: [
        { trait_type: "Location", value: location },
        { trait_type: "Price", value: `${price} ETH` }
      ]
    };

    // Upload to Pinata
    const pinataRes = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      metadata,
      {
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Uploaded to Pinata:", pinataRes.data);

    return res.status(200).json({
      cid: pinataRes.data.IpfsHash,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${pinataRes.data.IpfsHash}`
    });
  } catch (error) {
    console.error("❌ Pinata upload failed:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to upload to Pinata" });
  }
}
