import React, { useRef } from 'react';
import { UserIcon } from './icons';

// Utility to resize images client-side to prevent oversized payloads
const imageResizer = (base64Str: string, maxWidth: number, maxHeight: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }
      ctx.drawImage(img, 0, 0, width, height);
      
      const mimeType = base64Str.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png';
      resolve(canvas.toDataURL(mimeType, 0.9));
    };
    img.onerror = (error) => {
      reject(error);
    };
  });
};


interface ImageUploaderProps {
  uploadedImage: string | null;
  onImageUpload: (base64: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ uploadedImage, onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const originalImage = reader.result as string;
          const resizedImage = await imageResizer(originalImage, 1024, 1024);
          onImageUpload(resizedImage);
        } catch (error) {
          console.error("Error resizing image:", error);
          // Fallback to original image if resizing fails
          onImageUpload(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
        <h2 className="text-lg font-semibold text-white mb-2">1. Upload Your Face Photo</h2>
        <div 
            className="aspect-square w-full bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-brand-green-light hover:bg-gray-700 transition-colors"
            onClick={handleClick}
        >
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
        />
        {uploadedImage ? (
            <img src={uploadedImage} alt="Uploaded preview" className="object-cover w-full h-full rounded-lg" />
        ) : (
            <div className="text-center text-gray-400">
                <UserIcon className="w-16 h-16 mx-auto" />
                <p className="mt-2 font-semibold">Click to upload an image</p>
                <p className="text-sm">PNG, JPG, WEBP</p>
            </div>
        )}
        </div>
    </div>
  );
};

export default ImageUploader;