// Cloudinary configuration
const cloudinaryConfig = {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY,
    uploadPreset: "resqnet_uploads" // Create this upload preset in your Cloudinary dashboard
};

export const uploadToCloudinary = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', cloudinaryConfig.uploadPreset);
        formData.append('cloud_name', cloudinaryConfig.cloudName);
        formData.append('resource_type', 'auto'); // This allows PDF uploads

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const result = await response.json();
        
        return {
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            resource_type: result.resource_type
        };
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Failed to upload file to Cloudinary');
    }
};