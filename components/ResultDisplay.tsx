
import React from 'react';
import { DownloadIcon, SparklesIcon } from './icons';

interface ResultDisplayProps {
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingState: React.FC = () => (
  <div className="text-center">
    <SparklesIcon className="w-16 h-16 mx-auto text-brand-green-light animate-pulse" />
    <h3 className="mt-4 text-xl font-semibold text-white">Generating Your Portrait...</h3>
    <p className="mt-1 text-gray-400">The AI is working its magic. This can take a moment.</p>
  </div>
);

const InitialState: React.FC = () => (
    <div className="text-center text-gray-500">
        <SparklesIcon className="w-24 h-24 mx-auto" />
        <h3 className="mt-4 text-xl font-semibold text-gray-300">Your Portrait Awaits</h3>
        <p className="mt-1">Follow the steps to create your new profile picture.</p>
    </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
        <h3 className="text-xl font-semibold">Generation Failed</h3>
        <p className="mt-1">{message}</p>
    </div>
);


const ResultDisplay: React.FC<ResultDisplayProps> = ({ generatedImage, isLoading, error }) => {
  return (
    <div className="w-full aspect-square bg-gray-900/50 border-2 border-gray-700 rounded-lg flex items-center justify-center p-4">
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : generatedImage ? (
        <div className="relative group w-full h-full">
          <img src={generatedImage} alt="Generated portrait" className="object-contain w-full h-full rounded-lg" />
          <a
            href={generatedImage}
            download="gcc-hoodie-portrait.png"
            className="absolute bottom-4 right-4 bg-brand-green-light text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transform transition-transform group-hover:scale-105 hover:bg-green-500"
          >
            <DownloadIcon className="w-5 h-5" />
            Download
          </a>
        </div>
      ) : (
        <InitialState />
      )}
    </div>
  );
};

export default ResultDisplay;
