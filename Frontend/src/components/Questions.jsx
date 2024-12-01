import React from 'react';

export const Questions = () => {
  return (
    <div className="py-10 px-6 sm:px-12">
      {/* Separator */}
      <div className="border-t-2 border-gray-300 mb-10"></div>

      {/* Heading */}
      <div className="text-left mb-10">
        <h2 className="text-2xl sm:text-3xl font-semibold uppercase text-[#1B0454] tracking-wider text-left">
          Frequently asked<br />
          questions.
        </h2>
      </div>

    
      <div className="flex space-x-4">
 
        <button className="px-6 py-3 bg-[#F0F8FF] rounded-full text-[#1B0454] text-sm sm:text-base font-semibold">
          General
        </button>

        <button className="px-6 py-3 bg-[#F0F8FF] rounded-full text-[#1B0454] text-sm sm:text-base font-semibold">
          Installation
        </button>

    
        <button className="px-6 py-3 bg-[#F0F8FF] rounded-full text-[#1B0454] text-sm sm:text-base font-semibold">
          Privacy
        </button>
      </div>
    </div>
  );
};
