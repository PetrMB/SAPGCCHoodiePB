import React, { useRef } from 'react';
import { Hoodie } from '../types';
import { UploadIcon } from './icons';

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


interface HoodieUploaderProps {
  hoodie: Hoodie;
  onImageUpload: (colorId: Hoodie['id'], base64: string) => void;
}

const HoodieUploader: React.FC<HoodieUploaderProps> = ({ hoodie, onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const originalImage = reader.result as string;
          const resizedImage = await imageResizer(originalImage, 1024, 1024);
          onImageUpload(hoodie.id, resizedImage);
        } catch (error) {
          console.error("Error resizing hoodie image:", error);
          onImageUpload(hoodie.id, reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
      <h3 className="font-semibold text-white mb-2">{hoodie.name}</h3>
      <div 
        className="aspect-square w-full bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-brand-green-light transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
        />
        {hoodie.image ? (
          <img src={hoodie.image} alt={`${hoodie.name} preview`} className="object-cover w-full h-full rounded-lg" />
        ) : (
          <div className="text-gray-400">
            <UploadIcon className="w-12 h-12 mx-auto" />
            <p className="mt-2 text-sm font-semibold">Click to Upload</p>
          </div>
        )}
      </div>
    </div>
  );
};


interface SetupProps {
    hoodies: Hoodie[];
    onImageUpload: (colorId: Hoodie['id'], base64: string) => void;
}

const Setup: React.FC<SetupProps> = ({ hoodies, onImageUpload }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="max-w-4xl w-full mx-auto bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-700 shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-white">Hoodie Image Setup</h1>
        <p className="text-center text-gray-400 mt-2 mb-8 max-w-2xl mx-auto">
          Before we generate your portrait, please upload a reference image for each hoodie color. This is a one-time step and will be saved for future use.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hoodies.map(hoodie => (
            <HoodieUploader key={hoodie.id} hoodie={hoodie} onImageUpload={onImageUpload} />
          ))}
        </div>
         <p className="text-center text-xs text-gray-500 mt-8">
          The app will be ready once all three images are uploaded.
        </p>
      </div>
    </div>
  );
};

export default Setup;