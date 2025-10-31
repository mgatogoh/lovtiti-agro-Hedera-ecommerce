import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

// Load environment variables (only if not already loaded elsewhere)
dotenv.config();

const PINATA_BASE_URL = process.env.PINATA_BASE_URL || "https://api.pinata.cloud/pinning";

export const uploadToIPFS = async (file: Buffer | Blob, name: string) => {
  const formData = new FormData();

  // Node's FormData (from `form-data` package) doesn't directly accept Blobs,
  // so we handle both types explicitly.
  if (file instanceof Buffer) {
    formData.append("file", file, { filename: name });
  } else {
    // For Blob (browser context)
    formData.append("file", file, name);
  }

  const metadata = JSON.stringify({ name });
  formData.append("pinataMetadata", metadata);

  try {
    const res = await axios.post(`${PINATA_BASE_URL}/pinFileToIPFS`, formData, {
      maxBodyLength: Infinity,
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
        ...formData.getHeaders?.(), // add multipart headers in Node
      },
    });

    return res.data; // contains IpfsHash, PinSize, Timestamp
  } catch (err: any) {
    console.error("Error uploading to Pinata:", err.response?.data || err.message);
    throw new Error("Failed to upload file to IPFS");
  }
};
