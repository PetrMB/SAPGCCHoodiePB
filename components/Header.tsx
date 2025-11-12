
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="p-4 sm:p-6 text-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
        GCC Hoodie <span className="text-brand-green-light">Photo Booth</span>
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        Create your professional profile picture with our company gear.
      </p>
    </header>
  );
};

export default Header;
