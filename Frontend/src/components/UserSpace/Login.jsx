import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();
  const handleGoogleLogin = () => {
    window.location.href = 'https://ton-backend.com/auth/google'; // Remplace par ton URL backend
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F0F8FF] px-4 sm:px-8">
      <div className="bg-white shadow-md rounded-[60px] p-8 w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-semibold uppercase text-[#1B0454] tracking-wider text-center mb-8">
          Welcome Back
        </h2>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-3 rounded-2xl font-semibold text-lg hover:bg-red-600 transition flex items-center justify-center"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            alt="Google Logo"
            className="w-5 h-5 mr-2"
          />
          Continue with Google
        </button>

        <p className="text-center text-[#6C6384] mt-6">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-customBlue font-semibold cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};
