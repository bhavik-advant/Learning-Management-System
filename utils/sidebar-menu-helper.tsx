import type { ReactNode } from 'react';
import { RiDashboard2Line } from 'react-icons/ri';
import { HiUserGroup } from 'react-icons/hi';
import { BiBook, BiBell } from 'react-icons/bi';
import { FiUser } from 'react-icons/fi';
import { UserRole } from '@/types/types';

type MenuItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

export const sidebarMenu: Record<UserRole, MenuItem[]> = {
  admin: [
    {
      label: 'Dashboard',
      href: 'dashboard',
      icon: <RiDashboard2Line />,
    },
    {
      label: 'Users',
      href: 'users',
      icon: <HiUserGroup />,
    },
    {
      label: 'Courses',
      href: 'courses',
      icon: <BiBook />,
    },
    {
      label: 'Notifications',
      href: 'notification',
      icon: <BiBell />,
    },
  ],

  mentor: [
    {
      label: 'Dashboard',
      href: 'dashboard',
      icon: <RiDashboard2Line />,
    },
    {
      label: 'My Courses',
      href: 'courses',
      icon: <BiBook />,
    },
    {
      label: 'Students',
      href: 'students',
      icon: <HiUserGroup />,
    },
  ],

  trainee: [
    {
      label: 'Dashboard',
      href: 'dashboard',
      icon: <RiDashboard2Line />,
    },
    {
      label: 'My Learning',
      href: 'courses',
      icon: <BiBook />,
    },
    {
      label: 'assignments',
      href: 'assignments',
      icon: <BiBell />,
    },
    {
      label: 'Profile',
      href: 'profile',
      icon: <FiUser />,
    },
  ],
};
