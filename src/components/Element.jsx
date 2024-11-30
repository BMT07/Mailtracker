import React from 'react';

export const Element = () => {
  return (
    <div className="py-16 px-6 sm:px-12">
      <div className="border-t-2 border-gray-300 mb-8"></div>

      <div className="text-left mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold uppercase text-customBlue tracking-wider">
          What is it ?
        </h2>
        <p className="text-lg font-poppins sm:text-xl md:text-2xl text-[#6C6384] mt-4 leading-relaxed">
          Stay on top of your emails with our tracking tool for Gmail and <br />Outlook. Get real-time insights on opens and clicks to boost <br />engagement and deliverability, all in an easy-to-use interface.
        </p>
      </div>

      {/* Trait séparateur après le texte */}
      <div className="border-t-2 border-gray-300 mb-8"></div>

      {/* 3 Blocks avec traits réactifs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Block 1 */}
        <div className="flex flex-col pb-4 lg:pb-0 lg:border-r-2 lg:border-gray-300">
          <img
            src={require('../assets/forward-66376.png')}
            alt="Real-Time Notifications"
            className="w-12 h-12 mb-2"
          />
          <h3 className="text-lg sm:text-xl font-semibold uppercase text-customBlue mb-2">
            Real-Time Notifications
          </h3>
          <p className="text-[#6C6384] text-sm sm:text-base ">
            Instantly know when your emails are opened<br/> or clicked, so you can follow up <br/>at the perfect time.
          </p>
        </div>

        {/* Block 2 */}
        <div className="flex flex-col  border-t-2 lg:border-t-0 lg:border-r-2 border-gray-300 pt-4 lg:pt-0 pb-4 lg:pb-0">
          <img
            src={require('../assets/mail_open-66390.png')}
            alt="Track email status"
            className="w-12 h-12 mb-2"
          />
          <h3 className="text-lg sm:text-xl font-semibold uppercase text-customBlue mb-2">
            Track email status
          </h3>
          <p className="text-[#6C6384] text-sm sm:text-base ">
            Easily monitor the delivery, open, and click<br/>  status of every email, helping you <br/> improve communication efficiency.
          </p>
        </div>

        {/* Block 3 */}
        <div className="flex flex-col  border-t-2 lg:border-t-0 border-gray-300 pt-4 lg:pt-0">
          <img
            src={require('../assets/mail_account_2-66386.png')}
            alt="Privacy First"
            className="w-12 h-12 mb-2"
          />
          <h3 className="text-lg sm:text-xl font-semibold uppercase text-customBlue mb-2">
            Privacy First
          </h3>
          <p className="text-[#6C6384] text-sm sm:text-base ">
            Your data stays secure. We prioritize your privacy, ensuring only you can access your email tracking details.
          </p>
        </div>
      </div>
    </div>
  );
};
