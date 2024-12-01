import React from 'react';
import { useNavigate } from 'react-router';

export const Section = () => {
  const navigate=useNavigate()

  return (
    <div className="relative mt-12 flex flex-col items-center justify-center px-6 py-12 text-center overflow-hidden">
      <div className="absolute inset-0 z-0 flex justify-center items-center">

        <div className="absolute w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] rounded-full border border-[#e3e1e6]">
          <span className="absolute bg-blue-500 w-3 h-3 rounded-full left-0 top-[60%] transform -translate-y-[50%]" />
          <span className="absolute bg-yellow-500 w-3 h-3 rounded-full right-0 top-[60%] transform -translate-y-[50%]" />
        </div>

        <div className="absolute w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] rounded-full border border-[#e3e1e6]">
        <span className="absolute bg-purple-500 w-3 h-3 rounded-full top-[60%] left-[99%] transform -translate-x-[50%] -translate-y-[50%]" />
        </div>

        <div className="absolute w-[100vw] h-[100vw] max-w-[1400px] max-h-[1400px] rounded-full border border-[#e3e1e6]">
           <span className="absolute bg-yellow-500 w-3 h-3 rounded-full top-[80%] left-[90%] transform -translate-x-[50%] -translate-y-[50%]" />
        </div>

        <div className="absolute w-[120vw] h-[120vw] max-w-[1800px] max-h-[1800px] rounded-full border border-[#e3e1e6]">
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex justify-center items-center gap-2 mb-8 w-full">
          <img
            src={require('../assets/Logo.png')}
            alt="Logo"
            className="h-6 w-auto"
          />
          <span className="text-customBlue text-xl font-semibold leading-tight">Mailtracker</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1B0454] mb-6 whitespace-nowrap">
          Unlock the Power of Your
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1B0454] mb-6 whitespace-nowrap">
          Emails with Intelligent
        </h2>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1B0454] mb-8 whitespace-nowrap">
          Tracking
        </h3>

        <button onClick={()=>navigate('/signup')} className="px-6 py-3 bg-customBlue text-white font-semibold rounded-full hover:bg-customBlueHover transition">
          Get Started for Free
        </button>
      </div>
    </div>
  );
};
