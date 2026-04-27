import type { ReactNode } from 'react';
import { RiDashboard2Line } from 'react-icons/ri';
import { HiUserGroup } from 'react-icons/hi';
import { BiBook, BiBell } from 'react-icons/bi';
import { FiUser } from 'react-icons/fi';
import { UserRole } from '@/types/types';
import { MdReviews } from 'react-icons/md';

type MenuItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

export const sidebarMenu: Record<UserRole, MenuItem[]> = {
  admin: [
    {
      label: 'Dashboard',
      href: 'app',
      icon: <RiDashboard2Line />,
    },
    {
      label: 'Users',
      href: 'app/users',
      icon: <HiUserGroup />,
    },
    {
      label: 'Courses',
      href: 'app/courses',
      icon: <BiBook />,
    },
    {
      label: 'Approvals',
      href: 'app/approvals',
      icon: <BiBook />,
    },
    {
      label: 'Submissions',
      href: 'app/submissions',
      icon: <BiBook />,
    },
    {
      label: 'Notifications',
      href: 'app/notification',
      icon: <BiBell />,
    },
  ],

  mentor: [
    {
      label: 'Dashboard',
      href: 'app',
      icon: <RiDashboard2Line />,
    },
    {
      label: 'My Courses',
      href: 'app/courses',
      icon: <BiBook />,
    },
    {
      label: 'Students',
      href: 'app/students',
      icon: <HiUserGroup />,
    },
    {
      label: 'Reviews',
      href: 'app/review',
      icon: <MdReviews />,
    },
  ],

  trainee: [
    {
      label: 'Dashboard',
      href: 'app',
      icon: <RiDashboard2Line />,
    },
    {
      label: 'My Learning',
      href: 'app/courses',
      icon: <BiBook />,
    },
    {
      label: 'Assignments',
      href: 'app/assignments',
      icon: <BiBell />,
    },
    {
      label: 'Submissions',
      href: 'app/submissions',
      icon: <BiBell />,
    },
    {
      label: 'Profile',
      href: 'app/profile',
      icon: <FiUser />,
    },
  ],
};
