import type { ReactNode } from 'react';
import { RiDashboard2Line, RiTodoLine } from 'react-icons/ri';
import { HiUserGroup } from 'react-icons/hi';
import { BiBook, BiBell, BiCheckShield, BiTask } from 'react-icons/bi';
import { FiUser } from 'react-icons/fi';
import { UserRole } from '@/types/types';
import { MdOutlineAssignment, MdReviews } from 'react-icons/md';
import { LuBookText } from 'react-icons/lu';
import { FaChalkboardTeacher } from 'react-icons/fa';

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
      icon: <BiCheckShield />,
    },
    {
      label: 'Submissions',
      href: 'app/review-submission',
      icon: <BiTask />,
    },
    {
      label: 'Assign Course',
      href: 'app/assign-course',
      icon: <FaChalkboardTeacher />,
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
      label: 'My Learning',
      href: 'app/assigned-courses',
      icon: <LuBookText />,
    },
    {
      label: 'Students',
      href: 'app/assign-course',
      icon: <HiUserGroup />,
    },
    {
      label: 'All Courses',
      href: 'app/courses',
      icon: <BiBook />,
    },
    {
      label: 'Assignments',
      href: 'app/assignments',
      icon: <MdOutlineAssignment />,
    },
    {
      label: 'Submissions',
      href: 'app/submissions',
      icon: <BiBell />,
    },
    {
      label: 'Reviews',
      href: 'app/review-submission',
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
      icon: <RiTodoLine />,
    },
    {
      label: 'Submissions',
      href: 'app/submissions',
      icon: <BiTask />,
    },
    {
      label: 'Profile',
      href: 'app/profile',
      icon: <FiUser />,
    },
  ],
};
