import Image from 'next/image';
import logo from '@/assets/education.png';
import { FiUser } from 'react-icons/fi';
import { RiDashboard2Line } from 'react-icons/ri';
import { BiBell, BiBook } from 'react-icons/bi';
import { HiUserGroup } from 'react-icons/hi';

function Sidebar() {
  return (
    <div className=" min-h-screen w-76 border-r border-gray-300">
      <div className="flex justify-start items-center p-4 gap-3 cursor-pointer border-b border-gray-300">
        <Image src={logo} alt="logo" width={42} height={42} />
        <h1 className="text-xl font-semibold tracking-tight">
          Tech<span className="text-blue-600">LMS</span>
        </h1>
      </div>

      <ul className="p-4 space-y-2">
        <li className="flex justify-start items-center rounded-md gap-4 p-4 ">
          <RiDashboard2Line className="text-xl" />
          <p className="font-semibold">DashBoard</p>
        </li>
        <li className="flex justify-start items-center rounded-md gap-4 p-4 ">
          <HiUserGroup className="text-xl" />
          <p className="font-semibold"> Users</p>
        </li>
        <li className="flex justify-start items-center rounded-md gap-4 p-4 ">
          <BiBook className="text-xl" />
          <p className="font-semibold">Course</p>
        </li>
        <li className="flex justify-start items-center rounded-md gap-4 p-4 ">
          <BiBell className="text-xl" />
          <p className="font-semibold">Notification</p>
        </li>
        <li className="flex justify-start items-center rounded-md gap-4 p-4 bg-blue-300">
          <FiUser className="text-xl" />
          <p className="font-semibold">Profile</p>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
