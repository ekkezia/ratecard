'use client'

import { TConfigg } from '@/config/config';
import { useCustomerContext } from '@/context/customer-context';
import React from 'react';

interface CardProps {
  dataId: number; // 0 = photography, 1 = web development
  defaultData: TConfigg;
  active: boolean;
  color: string;
}

const FrontSide: React.FC<CardProps> = ({ dataId, defaultData, color, active }) => {
  const { data, openModal, setOpenModal, currency } = useCustomerContext();
const { title, services, notes } = defaultData;

  const handleClickReveal = () => {
    if (!openModal) {
      console.log('updating open modal')
      setOpenModal(true);
    }     
  }

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
          <h1 className="font-jacquard12 text-xs">
            {title}
          </h1>
        </div>
        <div className={`${active ? "opacity-100" : "opacity-0"} transition-all duration-500 ease-in-out`}>
          {Object.entries(services).map(([key, value], index) => {
            return (
                <div key={index} className="mb-2 text-2xs w-full border-[0.2px] border-separate border-spacing-2 border-dashed border-gray-50 rounded-xs p-1">
                <div className="gap-1 flex justify-between">
                  <div className="">
                    <div className="text-2xs font-bold font-jacquard12 text-left">{value.title}</div>
                  <div className="text-4xs font-jacquard12 text-left">{value.description}</div>
                  </div>

                  <div className="text-2xs font-jacquard12 font-semibold text-right"><span className="text-6xs block text-white opacity-50">{currency?.toUpperCase()}</span>{data?.ratecardData && currency ? data?.ratecardData[dataId].services[key].price : <span className="text-gray-300 p-[1px] border-dashed border-[0.5px] hover:bg-white cursor-pointer" onClick={handleClickReveal}>REVEAL</span>}</div>

                </div>
                </div>
            )
          })}
        </div>
        <div className={`${active ? "opacity-100" : "opacity-0"} transition-all duration-500 ease-in-out`}>
          {notes?.map((note, index) => {
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