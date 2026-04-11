// lib/cloudinary.ts
import { UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadToCloudinary = async (file: File): Promise<UploadApiResponse> => {
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'lms',
        resource_type: 'auto', // Handles image, video, and raw files
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(null);
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
};
