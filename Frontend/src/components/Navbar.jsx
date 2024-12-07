import React, { useState } from 'react'
import { LuBadgeCheck } from "react-icons/lu";

export const Navbar = () => {
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
                    src={require('../assets/Logo.png')}
                    alt="Logo"
                    className="h-6 w-auto"
                />
            </div>

            <ul className="hidden md:flex space-x-8 font-poppins text-[#6C6384]">
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Features</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Pricing</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">FAQ</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Blog</li>
                <li className="hover:text-blue-600 transition-colors cursor-pointer">Support</li>
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
                    <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={closeMenu}>Features</li>
                    <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={closeMenu}>Pricing</li>
                    <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={closeMenu}>FAQ</li>
                    <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={closeMenu}>Blog</li>
                    <li className="hover:text-blue-600 transition-colors cursor-pointer" onClick={closeMenu}>Support</li>
                </ul>
            </div>

            <div className="flex items-center">
                <button
                    className={`hidden md:flex items-center mr-5 h-12 px-4 py-2 bg-customBlue text-white font-semibold rounded-full hover:bg-customBlueHover transition ${isMenuOpen ? 'hidden' : ''}`}
                >
                    <span className="mr-2 font-poppins">Install Now</span>
                    <LuBadgeCheck />
                </button>
            </div>

        </nav>
    )
}
