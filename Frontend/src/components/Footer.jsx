import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-[#22262A] text-white py-10 px-auto sm:px-12">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:gap-80 gap-20">
        {/* First Column */}
        <div className="flex flex-col items-center md:items-start text-white border-b-2 md:border-b-0 border-white pb-6 md:pb-0">
          <div className="flex items-center justify-center md:justify-start mb-4">
            <img
              src={require('../assets/Logo.png')}
              alt="MailTracker Logo"
              className="w-10 h-10 mr-3"
            />
            <h1 className="text-lg font-semibold">MailTracker</h1>
          </div>
          <div className="w-12 border-t-2 border-customBlue mb-4 mx-auto md:mx-0"></div>
          <p className="opacity-80 mb-2 text-center md:text-left">+1 891 989-11-91</p>
          <p className="opacity-80 text-center md:text-left">info@logoipsum.com</p>
        </div>

        {/* Second Column */}
        <div className="flex flex-col items-center md:items-start border-b-2 md:border-b-0 border-white pb-8 md:pb-0 lg:mx-16">
          <h2 className="text-sm font-semibold uppercase mb-6 text-white opacity-40">Resources</h2>
          <ul className="space-y-2 text-base text-center md:text-left">
            <li className="uppercase text-white opacity-60">Pricing /</li>
            <li className="uppercase text-white opacity-60">Blog /</li>
            <li className="uppercase text-white opacity-60">FAQs /</li>
            <li className="uppercase text-white opacity-60">Contact</li>
          </ul>
        </div>

        {/* Third Column */}
        <div className="flex flex-col items-center md:items-start pb-2 md:border-b-0">
          <h2 className="text-sm font-semibold uppercase mb-6 text-white opacity-40">Legal</h2>
          <ul className="space-y-2 text-base text-center md:text-left">
            <li className="uppercase text-white opacity-60">Privacy /<br /> Policy</li>
            <li className="uppercase text-white opacity-60">Terms of /<br /> Service</li>
            <li className="uppercase text-white opacity-60">GDPR<br /> Policy</li>
          </ul>
        </div>
      </div>

      {/* Separator at the bottom */}
      <div className="w-full border-t-2 border-white mt-10"></div>

      {/* Footer bottom section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-16 items-center text-center mt-6">
        {/* First Item: Chat */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center">
            <img
              src={require('../assets/messages-2.png')}
              alt="Message Icon"
              className="w-4 h-4"
            />
          </div>
          <span className="text-sm text-white">Let’s chat</span>
        </div>

        {/* Second Item: Email */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center">
            <img
              src={require('../assets/message-text.png')}
              alt="Email Icon"
              className="w-4 h-4"
            />
          </div>
          <span className="text-sm text-white">info@logoipsum.com</span>
        </div>

        {/* Third Item: Copyright */}
        <div className="flex items-center justify-center">
          <span className="text-sm text-white">©2024 - all rights reserved</span>
        </div>
      </div>
    </footer>
  );
};
