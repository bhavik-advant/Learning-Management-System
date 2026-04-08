import Image from 'next/image';
import logo from '@/assets/education.png';
import ThemeButton from '../ui/ThemeButton';
import Link from 'next/link';

function Navbar() {
  return (
    <nav className="w-full border-b border-gray-300  backdrop-blur-md sticky top-0 z-50">
      <div className="mx-4 xxl:mx-70 sm:mx-8 lg:mx-14 xl:mx-52 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer">
          <Image src={logo} alt="logo" width={42} height={42} />
          <h1 className="text-xl font-semibold tracking-tight">
            Tech<span className="text-blue-600">LMS</span>
          </h1>
        </div>

        <ul className="hidden sm:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
          <li className="hover:text-black dark:hover:text-white cursor-pointer transition">
            Features
          </li>
          <li className="hover:text-black dark:hover:text-white cursor-pointer transition">
            Workflow
          </li>
          <li className="hover:text-black dark:hover:text-white cursor-pointer transition">
            Roles
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <ThemeButton />
          <Link
            href="/auth/signup"
            className="px-4 py-1.5 text-sm font-medium rounded-md bg-black text-white hover:bg-gray-800 transition shadow-sm"
          >
            Sign in
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
