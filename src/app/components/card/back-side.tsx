import React from 'react';

interface BackSideProps {
  number: string;
  sign: string;
  color: string;
}

const BackSide: React.FC<BackSideProps> = ({ number, sign, color }) => {
  return (
    <div className="flex flex-col justify-between h-full w-full p-[4px] lg:p-2" style={{ color: color, background: 'white' }}>
      <div className="flex items-center justify-start text-xl opacity-50 font-jacquard20 text-center">
        <div className="font-jacquard12 text-md">{number}</div>
      </div>

      <div className="flex items-center justify-center text-6xl opacity-30 font-jacquard12 text-center">
        {sign}
      </div>

      <div className="flex items-center justify-end text-xl opacity-50 font-jacquard20 text-center">
        <div className="font-jacquard12 text-md">{number}</div>
      </div>
    </div>
  );
};

export default BackSide;