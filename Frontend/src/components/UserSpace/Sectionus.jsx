import React from 'react';

export const Sectionus = () => {
  return (
    <>
      <div className="border-t-2 border-gray-300 mb-10"></div>

      <div className="flex flex-col p-6 w-full md:w-2/5 border-gray-300">
        {/* Image et texte en haut */}
        <div className="flex items-center mb-6">
          <img
            src={require('./assetsus/personne.png')} // Remplace par l'image réelle
            alt="Ali K."
            className="h-12 w-12 rounded-full object-cover mr-4"
          />
          <span className="text-[#1B0454] text-xl font-semibold">
            Ali<br />
            Kwatcha.
          </span>
        </div>

        {/* Premier carré */}
        <div className="w-full p-6 bg-[#007AFF] rounded-[25px] mb-6">
          <div className="flex items-center mb-2">
            <img
              src={require('./assetsus/Vector2.png')} // Remplace par l'image réelle
              alt="My plan"
              className="h-6 w-6 mr-2"
            />
            <span className="text-white font-medium">My plan</span>
          </div>
          <div className="text-white">
            <p className="font-bold text-4xl">Free</p>
          </div>
          <div className="border-t border-white mt-2 mb-2"></div>
          <div className="text-white mb-4">
            <p className="text-xs mt-1">$0 per user, per month</p>
          </div>
        </div>

        {/* Deuxième carré */}
        <div className="w-full p-4 bg-[#FFFFFF] rounded-3xl mb-4">
          <div className="flex items-center mb-2">
            <img
              src={require('./assetsus/Frame 32.png')} // Remplace par l'image réelle
              alt="Manage payment methods"
              className="h-6 w-6 mr-2"
            />
            <span className="text-black font-medium">Manage payment methods</span>
          </div>
        </div>

        {/* Troisième carré */}
        <div className="w-full p-4 bg-[#FFFFFF] rounded-3xl mb-4">
          <div className="flex items-center mb-2">
            <img
              src={require('./assetsus/Frame 15.png')} // Remplace par l'image réelle
              alt="Contact support"
              className="h-6 w-6 mr-2"
            />
            <span className="text-black font-medium">Contact support</span>
          </div>
        </div>

        {/* Quatrième carré */}
        <div className="w-full p-4 bg-[#FF01050D] rounded-3xl mt-auto ">
          <div className="flex items-center">
            <img
              src={require('./assetsus/Frame 8.png')} // Remplace par l'image réelle
              alt="Cancel subscription"
              className="h-6 w-6 mr-2"
            />
            <span className="text-[#FF0105] font-medium">Cancel my subscription</span>
          </div>
        </div>
      </div>
    </>
  );
};
