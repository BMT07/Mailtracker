import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = 'https://ton-backend.com/auth/google';
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-150 to-blue-200 px-4 sm:px-8">
      {/* Cercles concentriques */}
      <div className="absolute inset-0 z-0 flex justify-center items-center overflow-hidden">
        <div className="absolute w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] rounded-full border border-blue-300 opacity-50">
          <span className="absolute bg-blue-500 w-3 h-3 rounded-full left-0 top-[60%] transform -translate-y-[50%]" />
          <span className="absolute bg-yellow-500 w-3 h-3 rounded-full right-0 top-[60%] transform -translate-y-[50%]" />
        </div>

        <div className="absolute w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] rounded-full border border-blue-300 opacity-30">
          <span className="absolute bg-purple-500 w-3 h-3 rounded-full top-[60%] left-[99%] transform -translate-x-[50%] -translate-y-[50%]" />
        </div>

        <div className="absolute w-[100vw] h-[100vw] max-w-[1400px] max-h-[1400px] rounded-full border border-blue-300 opacity-20">
          <span className="absolute bg-yellow-500 w-3 h-3 rounded-full top-[80%] left-[90%] transform -translate-x-[50%] -translate-y-[50%]" />
        </div>

        <div className="absolute w-[120vw] h-[120vw] max-w-[1800px] max-h-[1800px] rounded-full border border-blue-300 opacity-10"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative bg-white shadow-xl rounded-3xl p-10 w-full max-w-sm transition-all hover:shadow-2xl z-10">
        <h2 className="text-4xl font-extrabold text-[#1B0454] text-center mb-6">
          Welcome Back!
        </h2>
        <p className="text-center text-[#6C6384] text-sm mb-8">
          Log in quickly and securely using Google.
        </p>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-[#4285F4] text-white py-3 rounded-full font-semibold text-lg hover:bg-[#357ae8] transition-all flex items-center justify-center shadow-md"
        >
          <img
            src={require('./assetsus/logo_google.png')}
            alt="Google Logo"
            className="w-5 h-5 mr-2"
          />
          Continue with Google
        </button>

        <p className="text-center text-[#6C6384] mt-6 text-sm">
          Don’t have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-blue-500 font-semibold cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};
