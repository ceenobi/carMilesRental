import { v2 as cloudinary, type UploadApiOptions } from "cloudinary";
import { env } from "./keys.js";
import logger from "./logger.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_SECRET_KEY,
  secure: true,
});

export const uploadToCloudinary = async (
  file: string,
  options: Partial<UploadApiOptions> = {},
) => {
  try {
    const defaultOptions: UploadApiOptions = {
      folder: "MILESRIDE",
      resource_type: "auto",
      // Image optimization settings
      quality: "auto",
      fetch_format: "auto",
      // Delivery optimization
      eager: [
        { width: 800, height: 600, crop: "limit" },
        { width: 400, height: 300, crop: "limit" },
      ],
      // Performance optimization
      responsive_breakpoints: {
        create_derived: true,
        transformation: {
          quality: "auto:good",
          fetch_format: "auto",
        },
      },
      secure: true,
      optimize: true,
      ...options,
    };

    const uploadResponse = await cloudinary.uploader.upload(
      file,
      defaultOptions,
    );
    return {
      mediaUrl: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    };
  } catch (error: any) {
    logger.error(`Upload failed: ${error.error.message}`);
    throw new Error(`Upload failed: ${error.error.message}`);
  }
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error: any) {
    logger.error(`Deletion failed: ${error.error.message}`);
    throw new Error(`Deletion failed: ${error.error.message}`);
  }
};