const MAX_NFT_FILE_SIZE = 50 * 1024 * 1024;

const ALLOWED_NFT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/quicktime",
];

export async function uploadNFTArtworkToCloudinary(
  file: File,
): Promise<string> {
  if (!ALLOWED_NFT_TYPES.includes(file.type)) {
    throw new Error("Choose a JPG, PNG, GIF, WebP, MP4, or MOV file.");
  }

  if (file.size > MAX_NFT_FILE_SIZE) {
    throw new Error("NFT artwork must not exceed 50 MB.");
  }

  if (file.size === 0) {
    throw new Error("The selected file is empty.");
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary is not configured.");
  }

  const resourceType = file.type.startsWith("video/") ? "video" : "image";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "nova/nfts");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "NFT artwork upload failed.");
  }

  if (!data.secure_url) {
    throw new Error("Cloudinary did not return an artwork URL.");
  }

  return data.secure_url as string;
}
