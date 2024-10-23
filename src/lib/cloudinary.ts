// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Add your Cloudinary Cloud Name here
  api_key: process.env.CLOUDINARY_API_KEY, // Add your Cloudinary API Key here
  api_secret: process.env.CLOUDINARY_API_SECRET, // Add your Cloudinary API Secret here
});

export default cloudinary;
