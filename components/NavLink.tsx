'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavLink: React.FC<{ children: React.ReactNode; href: string }> = ({ children, href }) => {
  const pathname = usePathname();

  const isActive = pathname.includes(href);

  return (
    <li>
      <Link
        className={`flex items-center rounded-md  gap-4 p-4 ${isActive ? 'bg-blue-300' : 'hover:bg-blue-300/20'}`}
        href={href}
      >
        {children}
      </Link>
    </li>
  );
};

export default NavLink;
