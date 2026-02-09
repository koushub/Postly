import React, { useState } from 'react';
import { uploadImage } from '../services/nodeService';
import { Image as ImageIcon, Loader, X } from 'lucide-react';

const ImageUpload = ({ onUploadSuccess, initialImage }) => {
  const [preview, setPreview] = useState(initialImage || null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setLoading(true);

    try {
      const firebaseUrl = await uploadImage(file);

      onUploadSuccess(firebaseUrl);
    } catch (error) {
      alert("Failed to upload image");
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadSuccess("");
  };

  return (
    <div className="form-control w-full mb-4">
      <label className="label">
        <span className="label-text font-semibold">Post Image</span>
      </label>
      
      {!preview ? (
        <div className="border-2 border-dashed border-base-300 rounded-lg p-6 flex flex-col items-center justify-center text-base-content/50 hover:border-primary hover:text-primary transition-colors cursor-pointer relative">
            <input 
                type="file" 
                onChange={handleFileChange} 
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {loading ? <Loader className="animate-spin mb-2" /> : <ImageIcon size={32} className="mb-2" />}
            <span className="text-sm">{loading ? "Uploading..." : "Click to Upload Image"}</span>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-base-300">
           <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
           <button 
             onClick={handleRemove}
             className="btn btn-circle btn-sm btn-error absolute top-2 right-2 text-white"
             type="button"
           >
             <X size={16} />
           </button>
           {loading && (
             <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                <Loader className="animate-spin" />
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;