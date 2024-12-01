import React, { useState, useEffect } from 'react';

export const Feature = () => {
  const images = [
    require('../assets/Feature 2 (2).png'),
    require('../assets/Feature 2.png'),
    require('../assets/Feature 4 (1).png'),
    require('../assets/Feature 5 (1).png'),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // État pour gérer le défilement automatique

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

  // Gestion du défilement automatique
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        nextImage();
      }, 3000); // Change l'image toutes les 3 secondes
    }
    return () => clearInterval(interval); // Nettoie l'intervalle lors du démontage ou de la pause
  }, [isPlaying]);

  // Fonction pour basculer l'état de pause/lecture
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative flex justify-center items-center h-full w-full pb-16 lg:mx-0 sm:mx-6 md:ms-4">
      {/* Image affichée */}
      <img
        src={images[currentIndex]}
        alt={`Image${currentIndex + 1}`}
        className={`max-w-full max-h-full object-contain ${
          currentIndex !== 0 ? 'rounded-[80px]' : ''
        }`}
      />

      {/* Boutons précédent/suivant */}
      <div
        className="absolute flex items-center justify-between bg-[#E3EBF9] p-2 rounded-full"
        style={{
          width: '100px',
          height: '50px',
          bottom: '10px',
          right: '40px',
        }}
      >
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

      {/* Bouton Pause/Play */}
      <div
        className="absolute flex items-center space-x-4"
        style={{
          bottom: '10px',
          left: '40px',
        }}
      >
        <div
          onClick={togglePlayPause}
          className="flex items-center justify-center w-10 h-10 bg-[#E3EBF9] rounded-full cursor-pointer hover:bg-gray-200"
        >
          {isPlaying ? (
            <div className="flex space-x-1" style={{ color: '#1B0454' }}>
              {/* Icone Pause */}
              <div className="w-1 h-4 bg-current rounded"></div>
              <div className="w-1 h-4 bg-current rounded"></div>
            </div>
          ) : (
            <div className="w-3 h-3 bg-current rounded-full" style={{ color: '#1B0454' }}></div>
          )}
        </div>
      </div>

      {/* Indicateurs de navigation */}
      <div
        className="absolute flex items-center justify-center bg-[#E3EBF9] rounded-full px-3 py-2"
        style={{
          bottom: '20px',
        }}
      >
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
  );
};
