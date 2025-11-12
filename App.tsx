import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ColorSelector from './components/ColorSelector';
import ResultDisplay from './components/ResultDisplay';
import Instructions from './components/Instructions';
import { generatePortrait } from './services/geminiService';
import { Hoodie, HoodieColor } from './types';
import { SparklesIcon } from './components/icons';
import { INITIAL_HOODIES } from './constants';
import Setup from './components/Setup';

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<HoodieColor>('green');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [hoodies, setHoodies] = useState<Hoodie[]>(INITIAL_HOODIES);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedHoodies = localStorage.getItem('hoodies');
      if (savedHoodies) {
        const parsedHoodies: Hoodie[] = JSON.parse(savedHoodies);
        const mergedHoodies = INITIAL_HOODIES.map(initialHoodie => {
            const saved = parsedHoodies.find(h => h.id === initialHoodie.id);
            return saved?.image ? { ...initialHoodie, image: saved.image } : initialHoodie;
        });
        setHoodies(mergedHoodies);
      }
    } catch (e) {
      console.error("Failed to load hoodies from localStorage", e);
      setError("Could not load saved settings. Your browser's storage might be corrupted or inaccessible.");
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!uploadedImage) {
      setError("Please upload an image first.");
      return;
    }

    const selectedHoodie = hoodies.find(h => h.id === selectedColor);
    if (!selectedHoodie?.image) {
      setError("Hoodie images are not set up. Please upload your face photo to begin setup.");
      setIsSetupModalOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generatePortrait(uploadedImage, selectedHoodie.image, customPrompt);
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.toString() || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage, selectedColor, customPrompt, hoodies]);

  const handleFaceImageUpload = (base64: string) => {
    setUploadedImage(base64);
    const isSetupComplete = hoodies.every(h => h.image);
    if (!isSetupComplete) {
        setIsSetupModalOpen(true);
    }
  };

  const handleHoodieImageUpload = (hoodieId: Hoodie['id'], base64: string) => {
      const updatedHoodies = hoodies.map(h => 
          h.id === hoodieId ? { ...h, image: base64 } : h
      );
      setHoodies(updatedHoodies);

      try {
          // Perform a health check on localStorage to ensure it's writable
          const testKey = 'storage_test';
          localStorage.setItem(testKey, 'test');
          localStorage.removeItem(testKey);

          const dataToStore = JSON.stringify(updatedHoodies);
          localStorage.setItem('hoodies', dataToStore);

          // Verify that the data was actually saved
          if (localStorage.getItem('hoodies') !== dataToStore) {
              throw new Error("Failed to verify saved data. Storage might be restricted or full.");
          }
      } catch (e) {
          console.error("Failed to save hoodies to localStorage", e);
          setError("Could not save hoodie images. Your browser might be in private/incognito mode, or have site data storage disabled. Please check your browser settings.");
      }

      if (updatedHoodies.every(h => h.image)) {
          setIsSetupModalOpen(false);
      }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      {isSetupModalOpen && (
        <Setup hoodies={hoodies} onImageUpload={handleHoodieImageUpload} />
      )}
      <div className="max-w-7xl mx-auto">
        <Header />

        <main className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            <ImageUploader uploadedImage={uploadedImage} onImageUpload={handleFaceImageUpload} />
            <ColorSelector selectedColor={selectedColor} onColorSelect={setSelectedColor} hoodies={hoodies} />
            
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">3. (Optional) Add Corrections</h2>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g., 'smiling', 'add glasses', 'in a modern office background'"
                className="w-full h-24 p-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-green-light focus:border-brand-green-light transition-colors"
              />
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={isLoading || !uploadedImage}
              className="w-full bg-brand-green-light text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 text-lg hover:bg-green-500 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? 'Generating...' : <><SparklesIcon className="w-6 h-6" /> Generate Portrait</>}
            </button>

          </div>

          <div className="md:col-span-1 lg:col-span-2">
            <ResultDisplay generatedImage={generatedImage} isLoading={isLoading} error={error} />
          </div>

          <div className="md:col-span-2 lg:col-span-3 mt-4">
              <Instructions />
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;