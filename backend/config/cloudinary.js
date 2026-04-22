import { v2 as cloudinary } from 'cloudinary';

// Configure cloudinary with environment variables
// This will be called AFTER dotenv.config() in server.js
export const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✅ Cloudinary configured:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✓' : '✗',
    api_key: process.env.CLOUDINARY_API_KEY ? '✓' : '✗',
    api_secret: process.env.CLOUDINARY_API_SECRET ? '✓' : '✗'
  });
};

export default cloudinary;
