import Image from 'next/image';
import logo from '@/public/light-eduvant.png';
import Darklogo from '@/public/dark-eduvant.png';
import { BsInstagram, BsTwitter } from 'react-icons/bs';
import { LiaLinkedin } from 'react-icons/lia';
export default function Footer() {
  return (
    <>
      <div className="grid grid-cols-4 border-t border-gray-300 py-10 px-4 xxl:px-70 sm:px-8 lg:px-14 xl:px-52">
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
        <div>
          <p className="font-semibold text-lg pb-1">Product</p>
          <ul className="text-gray-500">
            <li className="cursor-pointer">Features</li>
            <li className="cursor-pointer">Workflow</li>
            <li className="cursor-pointer">Roles</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-lg pb-1">Company</p>
          <ul className="text-gray-500">
            <li className="cursor-pointer">About</li>
            <li className="cursor-pointer">Careers</li>
            <li className="cursor-pointer">Contact</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-lg pb-1">Connect</p>
          <div className="flex gap-4">
            <div className="bg-gray-300 dark:bg-gray-600 p-2 rounded-md cursor-pointer">
              <BsTwitter />
            </div>
            <div className="bg-gray-300 dark:bg-gray-600 p-2 rounded-md cursor-pointer">
              <LiaLinkedin />
            </div>
            <div className="bg-gray-300 dark:bg-gray-600 p-2 rounded-md cursor-pointer">
              <BsInstagram />
            </div>
          </div>
        </div>
      </div>
      <div className="py-6 px-4 xxl:px-70 sm:px-8 lg:px-14 xl:px-52 border-t border-gray-300 text-gray-500 ">
        @2026 TechLMS , All Rights Reserved
      </div>
    </>
  );
}
