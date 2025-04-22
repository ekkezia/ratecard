'use client'

import { TService } from '@/app/config/config';
import React from 'react';

interface CardProps {
  title: string;
  color: string;
  services: TService[];
  notes: string[];
  active: boolean;
}

const FrontSide: React.FC<CardProps> = ({ title, color, services, notes, active }) => {
  return (
      <div 
        className="w-full h-full p-2 overflow-auto scrollbar relative"
        style={{
          background: color === "red" ? "rgba(255, 0, 0, 1)" : "rgba(0, 0, 0, 1)",
          color: color === "red" ? "black" : "white"
        }}
        >
        {/* <div className='absolute bottom-0 right-0 w-full h-full'>⬇</div> */}

        <div className="mb-2">
          <h1 className="font-jacquard12 text-sm">
            {title}
          </h1>
        </div>
        <div className={`${active ? "opacity-100" : "opacity-0"} transition-all duration-500 ease-in-out`}>
          {services.map((service, index) => {
            return (
                <div key={index} className="mb-2 text-2xs w-full border-[0.2px] border-separate border-spacing-2 border-dashed border-gray-50 rounded-xs p-1">
                <div className="gap-1 flex justify-between">
                  <div className="">
                    <div className="text-2xs font-bold font-jacquard12 text-left">{service.title}</div>
                    <div className="text-4xs font-jacquard12 text-left">{service.description}</div>
                  </div>

                  <div className="text-2xs font-jacquard12 font-semibold text-right"><span className="text-6xs block text-white opacity-50">IDR</span>{service.price}</div>

                </div>
                </div>
            )
          })}
        </div>
        <div className={`${active ? "opacity-100" : "opacity-0"} transition-all duration-500 ease-in-out`}>
          {notes.map((note, index) => {
            return (
                <div key={index} className="mb-1 text-4xs w-full text-left font-jacquard12">
                  {note}
                </div>
            )
          })}
        </div>

      </div>
  );
};

export default FrontSide;