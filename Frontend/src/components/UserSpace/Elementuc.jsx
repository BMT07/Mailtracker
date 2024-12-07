import React from 'react';

export const Elementuc = () => {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl md:text-3xl font-extrabold text-[#1B0454] uppercase mb-6 ">
        Your payment<br/> Methods
      </h1>

      <div className="space-y-6">
        {/* Premier carré */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <img
              src={require('./assetsus/Frame 404.png')} 
              alt="Pro monthly"
              className="h-12 w-12  object-cover mr-4"
            />
            <span className="text-lg text-[#1B0454] font-semibold">**** **** **** 1025</span>
          </div>
          <div className='text-[#6C6384]'>
            Exp 05/26
          </div>
        
        <div className="border-t border-gray-300 my-4"></div>
        <div className="flex items-center justify-between">
            <div>
           
            </div>

           
          </div>
        </div>
       
         
        </div>

        
      </div>
    
  );
};
