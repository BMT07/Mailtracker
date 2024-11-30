import React from 'react';

export const FAQSection2 = () => {
  return (
    <div className="py-10 px-6 sm:px-12">
      {/* Container for the two elements */}
      <div className="flex flex-col-reverse lg:flex-row items-center lg:items-stretch justify-between gap-6">
        {/* Left Element (Card) */}
        <div className="bg-[#22262A] rounded-[50px] p-6 sm:p-8 text-center flex-1 flex flex-col w-full">
          <h2 className="text-white text-2xl sm:text-3xl font-semibold leading-tight mb-4 text-left">
            Get Email Insights <br /> Instantly.
          </h2>
          <p className="text-white text-base sm:text-lg leading-relaxed mb-6 text-left">
            Install our free tracker and start getting valuable <br /> email data today.
          </p>
          <button className="bg-customBlue text-white font-semibold text-sm sm:text-base py-4 px-4 rounded-[15px] text-left self-start w-auto">
            Install the free addon
          </button>
        </div>

        {/* Right Element (Image) */}
        <div className="flex-1 w-full max-w-[450px] sm:max-w-[500px] md:max-w-[550px] lg:max-w-full">
          <img
            src={require('../assets/image 3.png')}
            alt="Illustration"
            className="w-full h-auto rounded-[40px]"
          />
        </div>
      </div>
    </div>
  );
};
