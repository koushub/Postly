import axios from 'axios';

const NODE_API_URL = 'https://postly-node-backend.onrender.com';

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(`${NODE_API_URL}/storage/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.filePath; 
  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
};