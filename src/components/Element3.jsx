import React from 'react';

export const Element3 = () => {
  return (
    <div className="py-5 px-6 sm:px-12">
      {/* Separator */}
      <div className="border-t-2 border-gray-300 mb-8"></div>

      {/* Rows */}
      <div className="space-y-12">
        {/* Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col order-1 lg:order-1">
            <h3 className="text-3xl font-semibold font-space-mono text-[#1B0454] mb-2 text-right">01</h3>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold uppercase text-customBlue mb-4 text-right">
              Unlimited Email Tracking
            </h2>
            <p className="text-sm sm:text-base  text-[#4E6F66] leading-relaxed text-right">
              Track an unlimited number of <br /> emails directly from Gmail, so you <br />never miss a critical interaction.
            </p>
          </div>

          <div className="border-8 border-[#1B0454] rounded-[25px] order-2 lg:order-2">
            <img
              src={require('../assets/image27.png')}
              alt="Unlimited Email Tracking"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="border-8 border-[#1B0454] rounded-[25px] order-2 lg:order-1">
            <img
              src={require('../assets/Frame 351.png')}
              alt="Real-Time Insights"
              className="w-full h-auto rounded-lg"
            />
          </div>

          <div className="flex flex-col order-1 lg:order-2">
            <h3 className="text-3xl font-semibold font-space-mono text-[#1B0454] mb-2 ">02</h3>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold uppercase text-customBlue mb-4">
              Instant push <br />Notifications
            </h2>
            <p className="text-sm sm:text-base text-[#4E6F66] leading-relaxed">
              Get notified the moment your<br /> email is opened allowing you to <br /> stay on top of follow-ups in real- <br /> time
            </p>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col order-1 lg:order-1">
            <h3 className="text-3xl font-semibold font-space-mono text-[#1B0454] mb-2 text-right">03</h3>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold uppercase text-customBlue mb-4 text-right">
              Mobile tracking
            </h2>
            <p className="text-sm sm:text-base text-[#4E6F66] leading-relaxed text-right">
              Track your emails on the go with <br />mobile support, giving you full <br /> visibility from your phone
            </p>
          </div>

          <div className="border-8 border-[#1B0454] rounded-[25px] order-2 lg:order-2">
            <img
              src={require('../assets/image23.png')}
              alt="Easy Integration"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="border-8 border-[#1B0454] rounded-[25px] order-2 lg:order-1">
            <img
              src={require('../assets/Frame 346.png')}
              alt="Privacy First"
              className="w-full h-auto rounded-lg"
            />
          </div>

          <div className="flex flex-col order-1 lg:order-2">
            <h3 className="text-3xl font-semibold font-space-mono text-[#1B0454] mb-2 ">04</h3>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold uppercase text-customBlue mb-4">
              Visible or transparent <br />tracker
            </h2>
            <p className="text-sm sm:text-base text-[#4E6F66] leading-relaxed opacity-100">
              Choose between a visible tracker<br /> or a hidden one, depending on <br />your tracking preferences and <br />needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
