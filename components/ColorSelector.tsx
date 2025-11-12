import React from 'react';
import { Hoodie, HoodieColor } from '../types';

interface ColorSelectorProps {
  selectedColor: HoodieColor;
  onColorSelect: (color: HoodieColor) => void;
  hoodies: Hoodie[];
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ selectedColor, onColorSelect, hoodies }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-2">2. Select Hoodie Color</h2>
      <div className="grid grid-cols-3 gap-4">
        {hoodies.map((hoodie) => (
          <button
            key={hoodie.id}
            onClick={() => onColorSelect(hoodie.id)}
            className={`relative p-2 rounded-lg transition-all duration-200 ${selectedColor === hoodie.id ? `ring-2 ${hoodie.selectedRingClass} shadow-lg` : 'ring-1 ring-gray-700 hover:ring-gray-500'}`}
          >
            {hoodie.image ? (
              <img src={hoodie.image} alt={hoodie.name} className="w-full aspect-square object-cover rounded-md" />
            ) : (
              <div className={`w-full aspect-square rounded-md ${hoodie.baseColorClass}`} />
            )}
            <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-bold text-white bg-black/50 px-2 py-1 rounded-md">{hoodie.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;