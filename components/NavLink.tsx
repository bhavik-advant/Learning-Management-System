'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavLinkProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

const NavLink: React.FC<NavLinkProps> = ({ href, icon, label }) => {
  const pathname = usePathname();

  const isActive = pathname.startsWith(href);

  return (
    <li className="list-none">
      <Link
        href={href}
        className={`group flex items-center gap-4 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
        ${
          isActive
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-black dark:hover:text-white'
        }`}
      >
        <span
          className={`text-lg transition ${
            isActive ? 'text-blue-600 dark:text-blue-400' : 'group-hover:scale-110'
          }`}
        >
          {icon}
        </span>

        <span className="tracking-tight">{label}</span>

        {isActive && (
          <span className="ml-auto w-1.5 h-5 rounded-full bg-blue-600 dark:bg-blue-400" />
        )}
      </Link>
    </li>
  );
};

export default NavLink;
