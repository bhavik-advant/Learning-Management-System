'use client';

import Image from 'next/image';
import logo from '@/public/light-eduvant.png';
import Darklogo from '@/public/dark-eduvant.png';
import { CgClose } from 'react-icons/cg';
import NavLink from './NavLink';
import { sidebarMenu } from '@/utils/sidebar-menu-helper';
import { UserRole } from '@/types/user';
import { Show, UserButton } from '@clerk/nextjs';
import ThemeButton from './ui/ThemeButton';
import { useNotificationCount } from '@/hooks/notification/useNotificationCount';
type SidebarProps = {
  show: boolean;
  onClick: () => void;
  role: UserRole;
  user?: {
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  };
};

const Sidebar: React.FC<SidebarProps> = ({ show, onClick, role, user }) => {
  const menuItems = sidebarMenu[role];

  const { count } = useNotificationCount();

  return (
    <aside
      className={`top-0 min-h-screen z-30 w-72 
      bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl 
      border-r border-gray-200 dark:border-gray-700 
      fixed lg:sticky flex flex-col
      transform transition-transform duration-300 ease-in-out
      ${show ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
    >
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
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

        <button
          onClick={onClick}
          className="lg:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <CgClose />
        </button>
      </div>

      <ul className="p-4 space-y-1">
        {menuItems.map((item, index) => {
          const fullPath = `/${item.href}`;

          return (
            <NavLink
              key={index}
              href={fullPath}
              icon={item.icon}
              label={
                item.label == 'Notifications'
                  ? `Notifications  ${count == 0 ? '' : `(${count})`}`
                  : item.label
              }
            />
          );
        })}
      </ul>

      <div className="mt-auto border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between gap-2 items-center">
        {user && (
          <div className="flex items-center gap-5">
            <Show when="signed-in">
              <UserButton />
            </Show>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{user.name || 'User'}</span>
              <span className="text-xs text-blue-600 dark:text-blue-400 capitalize">
                {user.role?.toLowerCase()}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
            </div>
          </div>
        )}
        <div>
          <ThemeButton />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
