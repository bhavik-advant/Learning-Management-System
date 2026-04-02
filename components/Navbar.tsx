'use client';
import Image from 'next/image';
import logo from '@/assets/education.png';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useState } from 'react';

function Navbar() {
  const [dark, setDark] = useState(false);

  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-4 xxl:mx-70 sm:mx-8 lg:mx-14 xl:mx-52 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer">
          <Image src={logo} alt="logo" width={42} height={42} />
          <h1 className="text-xl font-semibold tracking-tight">
            Tech<span className="text-blue-600">LMS</span>
          </h1>
        </div>

        <ul className="hidden sm:flex items-center gap-8 text-sm font-medium text-gray-600">
          <li className="hover:text-black cursor-pointer transition">Features</li>
          <li className="hover:text-black cursor-pointer transition">Workflow</li>
          <li className="hover:text-black cursor-pointer transition">Roles</li>
        </ul>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-md border hover:bg-gray-100 transition"
          >
            {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-black text-white hover:bg-gray-800 transition shadow-sm">
            Sign in
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
