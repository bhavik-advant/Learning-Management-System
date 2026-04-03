import Image, { StaticImageData } from 'next/image';
import React from 'react';

const RoleCard: React.FC<{
  title: string;
  description: string;
  text: string;
  svg: React.ReactNode;
  image: StaticImageData;
}> = ({ title, description, svg, text, image }) => {
  return (
    <div className=" rounded-2xl border border-white shadow-2xl shadow-gray-400 backdrop-blur-sm transition-all hover:border-purple-500/30 hover:shadow-md hover:shadow-purple-500/10 space-y-5">
      <div className="p-7 space-y-5">
        <div className="flex items-center gap-4 ">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-500/20 to-purple-500/20 ring-1 ring-white/10">
            {svg}
          </div>
          <div>
            <h2 className="text-xl text-bold">{title}</h2>
            <p className="text-sm">{description}</p>
          </div>
        </div>
        <p className="text-lg">{text}</p>
      </div>
      <div className="relative invert-90 h-48 rounded-b-2xl">
        <Image className="rounded-b-2xl" src={image} alt={'role image'} fill />
      </div>
    </div>
  );
};

export default RoleCard;
