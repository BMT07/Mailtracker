import React from 'react'
import { Navbarus } from './Navbarus'
import { Sectionus } from './Sectionus'
import { Elementuc } from './Elementuc'

export const UserCard = () => {
  return (
<div className="bg-[#F0F8FF] min-h-screen flex flex-col">
      <Navbarus />
      {/* Trait horizontal */}
      <div className="border-t-2 border-gray-300"></div>
      <div className="flex flex-1 flex-col md:flex-row relative">
        <Sectionus />
        {/* Trait vertical avec visibilité conditionnelle */}
        <div className="hidden md:block absolute top-0 left-[calc(40%)] h-full border-l-2 border-gray-300"></div>
        <Elementuc />
        
      </div>
    </div>
  )
}
