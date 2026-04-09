import Image from 'next/image';
import logo from '@/assets/education.png';
import { FiUser } from 'react-icons/fi';
import { RiDashboard2Line } from 'react-icons/ri';
import { BiBell, BiBook } from 'react-icons/bi';
import { HiUserGroup } from 'react-icons/hi';
import { CgClose } from 'react-icons/cg';
import NavLink from './NavLink';

const Sidebar: React.FC<{ show: boolean; onClick: () => void }> = ({ show, onClick }) => {
  return (
    <div
      className={`top-0 left-0 z-50 min-h-screen bg-white dark:bg-gray-800  w-76 border-r border-gray-300 fixed lg:relative transform transition-transform duration-300 ease-in-out ${show ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 `}
    >
      <div className="flex justify-between items-center p-4 gap-3 h-18 cursor-pointer border-b border-gray-300">
        <div className="flex justify-center items-center">
          <Image src={logo} alt="logo" width={42} height={42} />
          <h1 className="text-xl font-semibold tracking-tight">
            Tech<span className="text-blue-600">LMS</span>
          </h1>
        </div>

        <button onClick={onClick} className="lg:hidden">
          <CgClose />
        </button>
      </div>

      <ul className="p-4 space-y-2">
        <NavLink href="dashboard">
          <RiDashboard2Line className="text-xl" />
          <p className="font-semibold">DashBoard</p>
        </NavLink>
        <NavLink href="users">
          <HiUserGroup className="text-xl" />
          <p className="font-semibold">Users</p>
        </NavLink>
        <NavLink href="courses">
          <BiBook className="text-xl" />
          <p className="font-semibold">Courses</p>
        </NavLink>

        <NavLink href="notification">
          <BiBell className="text-xl" />
          <p className="font-semibold">Notification</p>
        </NavLink>

        <NavLink href="profile">
          <FiUser className="text-xl" />
          <p className="font-semibold">Profile</p>
        </NavLink>
      </ul>
    </div>
  );
};

export default Sidebar;
