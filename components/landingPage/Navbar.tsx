'use client';
import Image from 'next/image';
import logo from '@/public/light-eduvant.png';
import Darklogo from '@/public/dark-eduvant.png';
import ThemeButton from '../ui/ThemeButton';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Show, UserButton } from '@clerk/nextjs';

function Navbar({ role }: { role?: string }) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;
  return (
    <nav className="w-full border-b border-gray-300  backdrop-blur-md sticky top-0 z-50">
      <div className="mx-4 xxl:mx-70 sm:mx-8 lg:mx-14 xl:mx-52 py-3 flex items-center justify-between">
        <div className="flex justify-center items-center gap-2 dark:hidden">
          <Image
            src={logo}
            alt="EduVant logo"
            width={200}
            height={40}
            className="object-contain "
          />
        </div>
        <div className="flex justify-center items-center gap-2 hidden dark:block">
          <Image
            src={Darklogo}
            alt="EduVant logo"
            width={180}
            height={40}
            className="object-contain "
          />
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
          {isSignedIn && role ? (
            <Link
              href={`/${role}/dashboard`}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-md"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/auth/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md cursor-pointer"
            >
              Sign in
            </Link>
          )}
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
