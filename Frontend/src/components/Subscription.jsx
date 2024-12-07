import React, { useState } from 'react';

export const Subscription = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="py-10 px-6 sm:px-12">
      {/* Separator */}
      <div className="border-t-2 border-gray-300 mb-10"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold uppercase text-[#1B0454] tracking-wider text-left">
          Get started for free,<br />
          Upgrade easily based on<br /> your needs.
        </h2>

        <div className="flex items-center space-x-6 mt-4 sm:mt-0">
          {/* Option Monthly */}
          <div
            onClick={() => setIsYearly(false)}
            className={`relative flex items-center pl-3 justify-start w-32 h-12 border-4 transition-all duration-500 ${
              !isYearly
                ? 'border-customBlue scale-105 shadow-lg'
                : 'border-gray-300'
            } bg-white text-customBlue font-medium rounded-3xl cursor-pointer`}
          >
            Monthly
            <div
              className={`absolute right-1 w-4 h-4 border-4 ${
                !isYearly ? 'border-customBlue' : 'border-gray-300'
              } bg-white rounded-full`}
            ></div>
          </div>

          {/* Option Yearly */}
          <div
            onClick={() => setIsYearly(true)}
            className={`flex items-center justify-center w-32 h-12 transition-all duration-500 ${
              isYearly
                ? 'bg-customBlue text-white scale-105 shadow-lg'
                : 'bg-[#F0F8FF] text-[#1B0454]'
            } font-medium rounded-3xl cursor-pointer`}
          >
            Yearly
          </div>
        </div>
      </div>

      {/* Plans Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-center items-center">
        {/* Free Plan */}
        <div
          className={`bg-white border-4 border-[#F0F8FF] rounded-[60px] p-8 py-16 flex flex-col items-center text-center w-full sm:w-[600px] md:w-[700px] lg:w-[500px] mx-auto transition-transform duration-700 ${
            isYearly ? 'scale-95 opacity-75' : 'scale-100 opacity-100'
          }`}
        >
          <h3 className="text-[#1B0454] px-4 py-2 text-sm font-semibold uppercase mb-6">
            Free
          </h3>
          <div className="relative mb-8 w-1/3 mx-auto">
            <div className="border-t-2 border-customBlue"></div>
            <div className="absolute -top-1 left-0 w-2 h-2 bg-customBlue rounded-full"></div>
            <div className="absolute -top-1 right-0 w-2 h-2 bg-customBlue rounded-full"></div>
          </div>
          <h4 className="text-customBlue font-space-mono text-5xl font-bold mb-4">
            {isYearly ? '$0/year' : '$0'}
          </h4>
          <p className="text-[#1B0454] text-base mb-8">
            {isYearly ? 'per user, per year' : 'per user, per month'}
          </p>
          <button className="mt-6 bg-customBlue text-white px-8 py-4 rounded-2xl text-base font-semibold">
            Get started
          </button>
          <div className="relative my-8 w-1/3 mx-auto">
            <div className="border-t-2 border-customBlue"></div>
            <div className="absolute -top-1 left-0 w-2 h-2 bg-customBlue rounded-full"></div>
            <div className="absolute -top-1 right-0 w-2 h-2 bg-customBlue rounded-full"></div>
          </div>
          <p className="text-[#1B0454] text-base mb-6">
            Tracked emails per day: {isYearly ? 'Up to 2400' : 'Up to 200'}
          </p>
          <p className="text-[#1B0454] text-base mb-6">Track from mobile</p>
          <p className="text-[#1B0454] text-base mb-6">Mail notifications</p>
          <div className="mb-6 mx-auto text-[#1B0454]">-</div>
          <div className="mb-6 mx-auto text-[#1B0454]">-</div>
        </div>

        {/* Pro Plan */}
        <div
          className={`bg-customBlue rounded-[60px] p-8 py-16 flex flex-col items-center text-center w-full sm:w-[600px] md:w-[700px] lg:w-[500px] mx-auto transition-transform duration-700 ${
            isYearly ? 'scale-100 opacity-100' : 'scale-95 opacity-75'
          }`}
        >
          <div className="flex items-center gap-2 mb-6">
            <img
              src={require('../assets/Vector.png')}
              alt="vector"
              className="h-4 w-auto"
            />
            <h3 className="text-white text-sm font-semibold uppercase">Pro</h3>
          </div>
          <div className="relative mb-8 w-1/3 mx-auto">
            <div className="border-t-2 border-white"></div>
            <div className="absolute -top-1 left-0 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute -top-1 right-0 w-2 h-2 bg-white rounded-full"></div>
          </div>
          <h4 className="text-white font-space-mono text-5xl font-bold mb-4">
            {isYearly ? '$100/year' : '$10'}
          </h4>
          <p className="text-white text-base mb-8">
            {isYearly ? 'per user, per year' : 'per user, per month'}
          </p>
          <button className="mt-6 bg-white text-customBlue px-8 py-4 rounded-2xl text-base font-semibold">
            Get started
          </button>
          <div className="relative my-8 w-1/3 mx-auto">
            <div className="border-t-2 border-white"></div>
            <div className="absolute -top-1 left-0 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute -top-1 right-0 w-2 h-2 bg-white rounded-full"></div>
          </div>
          <p className="text-white text-base mb-8">
            Tracked emails per day: {isYearly ? 'Unlimited' : 'Up to 200'}
          </p>
          <p className="text-white text-base mb-6">Track from mobile</p>
          <p className="text-white text-base mb-6">Mail notifications</p>
          <p className="text-white text-base mb-6">Remove Mail Track Branding</p>
          <p className="text-white text-base mb-10">Real-time notifications</p>
        </div>
      </div>
    </div>
  );
};
