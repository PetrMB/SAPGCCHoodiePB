
import React from 'react';

const Step: React.FC<{ number: number; title: string; description: string }> = ({ number, title, description }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-8 h-8 bg-brand-green rounded-full flex items-center justify-center font-bold text-white">
            {number}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
    </div>
);


const Instructions: React.FC = () => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">How it works</h2>
        <div className="space-y-4">
            <Step number={1} title="Upload Your Photo" description="Choose a clear, front-facing photo of your face. Good lighting works best!" />
            <Step number={2} title="Choose Your Hoodie" description="Select your favorite color: green, white, or black." />
            <Step number={3} title="Add Custom Edits" description="Use the text prompt to make small adjustments like 'add glasses' or 'change background to a library'." />
            <Step number={4} title="Generate & Download" description="Click generate, wait for the magic, and download your new professional portrait." />
        </div>
    </div>
  );
};

export default Instructions;
