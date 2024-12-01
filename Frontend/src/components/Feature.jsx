import React, { useState } from 'react';

export const Feature = () => {
  // Liste des images
  const images = [
    require('../assets/Feature 2 (2).png'),
    require('../assets/Feature 2.png'),
    require('../assets/Feature 4 (1).png'),
    require('../assets/Feature 5 (1).png'),
  ];

  // État pour gérer l'image active
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fonction pour aller à l'image suivante
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Fonction pour aller à l'image précédente
  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative flex justify-center items-center h-full w-full pb-16 lg:mx-0 sm:mx-6 md:ms-4 ">
      {/* Image affichée */}
      <img
        src={images[currentIndex]}
        alt={`Image${currentIndex + 1}`}
        className={`max-w-full max-h-full object-contain ${
          currentIndex !== 0 ? 'rounded-[80px]' : ''
        }`}
      />

      {/* Boîte contenant les flèches (en bas à droite) */}
      <div
        className="absolute flex items-center justify-between bg-[#E3EBF9] p-2 rounded-full"
        style={{
          width: '100px',
          height: '50px',
          bottom: '10px', // Ajout d'une marge supplémentaire en bas
          right: '40px',
        }}
      >
        {/* Flèche gauche */}
        <div
          onClick={prevImage}
          className="flex items-center justify-center w-8 h-8 bg-white rounded-full cursor-pointer hover:bg-gray-200"
        >
          <img
            src={require('../assets/Line 10 (1).png')}
            alt="Prev"
            className="h-4 w-auto"
          />
        </div>

        {/* Flèche droite */}
        <div
          onClick={nextImage}
          className="flex items-center justify-center w-8 h-8 bg-white rounded-full cursor-pointer hover:bg-gray-200"
        >
          <img
            src={require('../assets/Line 10.png')}
            alt="Next"
            className="h-4 w-auto"
          />
        </div>
      </div>

      {/* Nouveaux éléments en bas à gauche */}
      <div
        className="absolute flex items-center space-x-4"
        style={{
          bottom: '10px', // Ajout d'une marge supplémentaire en bas
          left: '40px',
        }}
      >
        {/* Premier élément : Bouton Pause */}
        <div
          className="flex items-center justify-center w-10 h-10 bg-[#E3EBF9] rounded-full"
        >
          <div
            className="flex space-x-1"
            style={{
              color: '#1B0454', // Assurez-vous d'avoir défini cette variable CSS dans votre thème.
            }}
          >
            {/* Les deux barres parallèles */}
            <div className="w-1 h-4 bg-current rounded"></div>
            <div className="w-1 h-4 bg-current rounded"></div>
          </div>
        </div>

        {/* Deuxième élément : Indicateurs de défilement */}
        <div
          className="flex items-center justify-center bg-[#E3EBF9] rounded-full px-3 py-2"
        >
          {/* Petits cercles représentant le défilement */}
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${
                index === currentIndex ? 'bg-[#1B0454]' : 'bg-gray-400'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
