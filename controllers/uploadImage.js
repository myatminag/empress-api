import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

export const imageUpload = async (req, res, next) => {
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    });
    try {
        const upload = (req) => { 
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            })
        };

        const result = await upload(req);
        
        res
            .status(200)
            .json(result);
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};