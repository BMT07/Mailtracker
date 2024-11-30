import React from 'react';
import { Link } from 'react-router-dom';

export const Error404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F8FF] px-6 sm:px-12">
      {/* Conteneur principal */}
      <div className="text-center">
        {/* Illustration */}
       

        {/* Texte principal */}
        <h1 className="text-4xl sm:text-6xl font-semibold text-[#1B0454] mb-4">
          Oops! Page not found.
        </h1>

        {/* Texte secondaire */}
        <p className="text-lg sm:text-xl text-[#6C6384] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Bouton retour */}
        <Link
          to="/"
          className="inline-flex items-center bg-customBlue text-white px-8 py-4 rounded-full font-semibold hover:bg-customBlueHover transition"
        >
          Go Back Home
        </Link>
      </div>

      {/* Bas de page (facultatif) */}
      <div className="mt-12 text-sm text-[#6C6384]">
        <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    </div>
  );
};
