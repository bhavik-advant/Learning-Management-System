'use client';

import { usePathname } from 'next/navigation';

const CourseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const path = usePathname();

  const isAddCourse = path.includes('/add-course');
  const isContent = path.includes('/content');

  return (
    <div className=" mx-8 ">
      <nav className="my-6">
        <ul className="flex items-center justify-between  p-2">
          <li className="flex-1 text-center ">
            <span
              className={`block px-5 py-2 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                isAddCourse && 'text-blue-400'
              }`}
            >
              Course Details
            </span>
          </li>

          <li className="flex-1 text-center">
            <span
              className={`inline-block px-5 py-2 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                isContent && 'text-blue-400'
              }`}
            >
              Course Content
            </span>
          </li>
        </ul>
        <div className="relative  h-1 bg-gray-200 dark:bg-gray-500/30 rounded-full ">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${isContent ? 100 : 50}%` }}
          />

          <div className="absolute top-0 left-1/2 w-[4px] h-full bg-white dark:bg-[#1e2939] z-10" />
        </div>
      </nav>

      {children}
    </div>
  );
};

export default CourseLayout;
