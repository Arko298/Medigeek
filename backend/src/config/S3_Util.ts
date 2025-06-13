// file: services/s3.service.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import sharp from "sharp";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

// Upload file to S3
const uploadFile = async (fileBuffer: Buffer, mimetype: string, folder: string) => {
  const imageName = randomImageName();
  const key = `${folder}/${imageName}`;
  
  // Optimize image if it's an image file
  let optimizedBuffer = fileBuffer;
  if (mimetype.startsWith("image/")) {
    optimizedBuffer = await sharp(fileBuffer)
      .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();
  }

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: optimizedBuffer,
    ContentType: mimetype,
  };

  await s3Client.send(new PutObjectCommand(uploadParams));
  return key;
};

// Delete file from S3
const deleteFile = async (key: string) => {
  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  };

  await s3Client.send(new DeleteObjectCommand(deleteParams));
};

// Get signed URL for file access
const getFileUrl = async (key: string) => {
  if (!key) return null;
  
  const getObjectParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  };

  try {
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour expiry
    return url;
  } catch (error) {
    console.error("Error getting file URL:", error);
    return null;
  }
};

export { uploadFile, deleteFile, getFileUrl };