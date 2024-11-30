import React from 'react';

export const FAQSection = () => {
  return (
    <div className="bg-[#F0F8FF] rounded-[45px] px-6 sm:px-12 md:px-20 py-10 sm:py-14 lg:mx-8 max-w-[1430px] mx-auto">
      {/* Row 1 */}
      <div className="space-y-4 relative">
        {/* Question and Icon */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <h3 className="text-[#1B0454] font-semibold text-lg sm:text-xl w-full sm:w-3/4 lg:px-8">
            How does the mail tracker extension work?
          </h3>
          <div className="w-8 h-8 bg-[#1B0454] rounded-full flex items-center justify-center mt-4 sm:mt-0">
            <span className="text-white font-bold text-lg">×</span>
          </div>
        </div>

        {/* Answer */}
        <div className="relative">
          <p className="text-[#6C6384] text-sm sm:text-base leading-relaxed w-full sm:w-3/4 lg:px-8">
            Our mail tracker extension integrates seamlessly with Gmail to provide real-time tracking of your sent
            emails. It notifies you when your emails are opened and read. The extension works by embedding a small,
            invisible tracking pixel in your emails, which notifies our system when the email is opened. This data is
            then presented in your dashboard for easy access and review.
          </p>
          <span
            className="absolute top-0 left-0 sm:top-auto sm:left-auto sm:relative sm:pl-0 text-customBlue font-space-mono text-lg sm:translate-y-2"
          >
            01.
          </span>
        </div>
      </div>

      {/* Separator */}
      <div className="h-[2px] bg-white my-6"></div>

      {/* Row 2 */}
      <div className="space-y-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-customBlue font-space-mono text-lg">02.</span>
          <h3 className="text-[#1B0454] font-semibold text-lg sm:text-xl">
            Is my email data secure?
          </h3>
        </div>
        <div className="w-8 h-8 bg-[#FC4A1A33] rounded-full flex items-center justify-center mt-4 sm:mt-0">
          <span className="text-[#1B0454] font-bold text-lg">+</span>
        </div>
      </div>

      {/* Separator */}
      <div className="h-[2px] bg-white my-6"></div>

      {/* Row 3 */}
      <div className="space-y-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-customBlue font-space-mono text-lg">03.</span>
          <h3 className="text-[#1B0454] font-semibold text-lg sm:text-xl">
            Can I track emails from other email providers?
          </h3>
        </div>
        <div className="w-8 h-8 bg-[#FC4A1A33] rounded-full flex items-center justify-center mt-4 sm:mt-0">
          <span className="text-[#1B0454] font-bold text-lg">+</span>
        </div>
      </div>

      {/* Separator */}
      <div className="h-[2px] bg-white my-6"></div>

      {/* Row 4 */}
      <div className="space-y-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-customBlue font-space-mono text-lg">04.</span>
          <h3 className="text-[#1B0454] font-semibold text-lg sm:text-xl">
            What happens if I exceed the tracked emails limit?
          </h3>
        </div>
        <div className="w-8 h-8 bg-[#FC4A1A33] rounded-full flex items-center justify-center mt-4 sm:mt-0">
          <span className="text-[#1B0454] font-bold text-lg">+</span>
        </div>
      </div>
    </div>
  );
};
