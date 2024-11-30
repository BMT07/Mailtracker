import React from 'react';
import { useNavigate } from 'react-router';

export const Elementus = () => {
  const navigate=useNavigate()
  return (
    <div className="flex-1 p-6">
      {/* Titre principal */}
      <h1 className="text-3xl md:text-3xl font-extrabold text-[#1B0454] uppercase mb-6 ">
        Upgrade to<br/> Unlock More Features
      </h1>

      {/* Conteneur principal */}
      <div className="space-y-6">
        {/* Premier carré */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          {/* Photo et titre */}
          <div className="flex items-center mb-4">
            <img
              src={require('./assetsus/Generate B.png')} // Remplace par ton image réelle
              alt="Pro monthly"
              className="h-12 w-12 rounded-full object-cover mr-4"
            />
            <span className="text-[#FC4A1A] text-lg font-semibold">Pro Monthly</span>
          </div>
          <div className='text-[#6C6384]'>
          Perfect for individuals just getting started with email tracking. Track up to 50 emails<br/> per day, receive mobile notifications, and stay informed on when your emails are opened,<br/> all at no cost.
          </div>

          {/* Trait séparateur */}
          <div className="border-t border-gray-300 my-4"></div>

          {/* Prix et bouton */}
          <div className="flex items-center justify-between">
            {/* Prix */}
            <div>
              <p className="text-[#007AFF] text-2xl font-bold">$10</p>
              <p className="text-[#6C6384] text-sm">per user, per month</p>
            </div>
            {/* Bouton */}
            <button onClick={()=>navigate('/userCard')} className="bg-[#007AFF] text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-600 transition">
              Upgrade
            </button>
          </div>
        </div>

        {/* Deuxième carré (copie identique) */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          {/* Photo et titre */}
          <div className="flex items-center mb-4">
            <img
              src={require('./assetsus/Generate B.png')} // Remplace par ton image réelle
              alt="Pro monthly"
              className="h-12 w-12 rounded-full object-cover mr-4"
            />
            <span className="text-[#FC4A1A] text-lg font-semibold">Pro Yearly</span>
          </div>
          <div className='text-[#6C6384]'>
          Perfect for individuals just getting started with email tracking. Track up to 50 emails<br/> per day, receive mobile notifications, and stay informed on when your emails are opened,<br/> all at no cost.
          </div>

          {/* Trait séparateur */}
          <div className="border-t border-gray-300 my-4"></div>

          {/* Prix et bouton */}
          <div className="flex items-center justify-between">
            {/* Prix */}
            <div>
              <p className="text-[#007AFF] text-2xl font-bold">$100</p>
              <p className="text-[#6C6384] text-sm">per user, per month</p>
            </div>
            {/* Bouton */}
            <button onClick={()=>navigate('/userCard')} className="bg-[#007AFF] text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-600 transition">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
