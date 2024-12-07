import React, { useState } from 'react'

export const Navbarus = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="flex items-center justify-between px-6 py-4 relative">
            {/* Logo */}
            <div className="flex items-center">
                <img
                    src={require('../../assets/Logo.png')}
                    alt="Logo"
                    className="h-6 w-auto"
                />
                <span className="text-customBlue text-xl font-semibold leading-tight ml-2">Mailtracker</span>
            </div>

            <ul className="hidden md:flex space-x-8 font-poppins text-[#6C6384] items-center">
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Home</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Blog</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">FAQ</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Support</li>
                {/* Separator */}
                <li className="border-l border-gray-300 h-6"></li>
                <li className="flex items-center pl-4 space-x-2">
                    <span className="text-[#1B0454] font-semibold">Afi K.</span>
                    <img
                        src={require('./assetsus/AliK.png')} 
                        alt="Afi K."
                        className="h-8 w-8 rounded-full object-cover"
                    />
                </li>
            </ul>

            <div className="md:hidden absolute right-6 flex items-center">
                <button onClick={toggleMenu} className="text-gray-700">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} absolute top-0 right-0 w-full bg-white shadow-md py-4 px-6`}>
                <ul className="space-y-4 text-gray-700 font-medium">
                    <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={closeMenu}>Home</li>
                    <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={closeMenu}>Blog</li>
                    <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={closeMenu}>FAQ</li>
                    <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={closeMenu}>Support</li>
                </ul>
                <div className="flex items-center mt-4 space-x-2">
                    <span className="text-[#1B0454] font-semibold">Afi K.</span>
                    <img
                        src={require('../../assets/Logo.png')} 
                        alt="Afi K."
                        className="h-8 w-8 rounded-full object-cover"   
                    />
                </div>
            </div>
        </nav>
    )
}
