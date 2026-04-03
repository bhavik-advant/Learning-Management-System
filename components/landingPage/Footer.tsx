import Image from 'next/image';
import logo from '@/assets/education.png';
import { BsTwitter } from 'react-icons/bs';
import { LiaLinkedin } from 'react-icons/lia';
export default function Footer() {

    return(
        <>
            <div className="grid grid-cols-4 border-t border-gray-300 py-10 px-4 xxl:px-70 sm:px-8 lg:px-14 xl:px-52">
                <div className="flex items-center gap-3 cursor-pointer">
                    <Image src={logo} alt="logo" width={42} height={42} />
                    <h1 className="text-xl font-semibold tracking-tight">
                        Tech<span className="text-blue-600">LMS</span>
                    </h1>
                </div>
                <div>
                    <p className='font-semibold text-lg pb-1'>Product</p>
                    <ul className='text-gray-500'>
                        <li className='cursor-pointer'>Features</li>
                        <li className='cursor-pointer'>Workflow</li>
                        <li className='cursor-pointer'>Roles</li>
                    </ul>
                </div>
                <div>
                    <p className='font-semibold text-lg pb-1'>Company</p>
                    <ul className='text-gray-500'>
                        <li className='cursor-pointer'>About</li>
                        <li className='cursor-pointer'>Careers</li>
                        <li className='cursor-pointer'>Contact</li>
                    </ul>
                </div>
                <div>
                    <p className='font-semibold text-lg pb-1'>Connect</p>
                    <div className='flex gap-4'>
                    <div className='bg-gray-300 p-2 rounded-md cursor-pointer'>
                        <BsTwitter />
                    </div>
                    <div className='bg-gray-300 p-2 rounded-md cursor-pointer'>
                        <LiaLinkedin />
                    </div>
                    <div className='bg-gray-300 p-2 rounded-md cursor-pointer'>
                        <BsTwitter />
                    </div>
                    </div>
                </div>
                
            </div>
            <div className='py-6 px-4 xxl:px-70 sm:px-8 lg:px-14 xl:px-52 border-t border-gray-300 text-gray-500'>
                @2026 TechLMS , All Rights Reserved
                
            </div>
        </>
    )
    
}