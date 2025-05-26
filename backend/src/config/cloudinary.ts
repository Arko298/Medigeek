import { v2 as cloudinary } from 'cloudinary';

import fs from 'fs'
import dotenv from 'dotenv';
dotenv.config();

    // Configuration
    cloudinary.config({ 
        cloud_name: 'dutkgt9dx', 
        api_key: process.env.CLOUDINARY_API_KEY, // Click 'View API Keys' above to copy your API key
        api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
    });
    
    const uploadOnCloudinary = async (localFilePath:any) => {
        try {
            if(!localFilePath) return null
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: 'auto',
                folder: 'uploads'
            })
            fs.unlinkSync(localFilePath)
            return response
            
        } catch (error) {
            console.log('Error uploading to cloudinary', error)
            fs.unlinkSync(localFilePath)
            return null
        }}
        const deleteFromCloudinary = async (publicId: any) => {
            try {
                await cloudinary.uploader.destroy(publicId)
                console.log('Successfully deleted from cloudinary');
            } catch (error) {
                console.log('Error deleting from cloudinary', error)
                return null;
            }
            
        }
    
    
    export  {uploadOnCloudinary, deleteFromCloudinary }; 
