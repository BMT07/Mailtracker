import React from 'react';
import { Link,useNavigate } from 'react-router-dom';

export const Login = () => {
    const navigate=useNavigate()
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F0F8FF] px-4 sm:px-8">
      <div className="bg-white shadow-md rounded-[60px] p-8 w-full max-w-md">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-semibold uppercase text-[#1B0454] tracking-wider text-center mb-8">
          Welcome Back
        </h2>

        {/* Form */}
        <form>
          {/* Email */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-[#6C6384] font-semibold mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full border-4 border-[#F0F8FF] rounded-2xl px-4 py-3 text-[#1B0454] bg-[#F0F8FF] focus:outline-none focus:border-customBlue"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-[#6C6384] font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full border-4 border-[#F0F8FF] rounded-2xl px-4 py-3 text-[#1B0454] bg-[#F0F8FF] focus:outline-none focus:border-customBlue"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-customBlue text-white py-3 rounded-2xl font-semibold text-lg hover:bg-customBlueHover transition"
            onClick={()=>navigate('/userSpace')}
          >
            Log In
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[#6C6384] mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-customBlue font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
