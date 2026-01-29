import axios from 'axios';

// This points to your Node.js Microservice
const NODE_API_URL = 'https://postly-node-backend.onrender.com';

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    // We use the '/storage/upload' route we defined in the previous step
    const response = await axios.post(`${NODE_API_URL}/storage/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // Returns the public Firebase URL
    return response.data.filePath; 
  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
};