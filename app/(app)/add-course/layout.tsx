'use client';

import { usePathname } from 'next/navigation';

const CourseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const path = usePathname();

  const isAddCourse = path.includes('/add-course');
  const isContent = path.includes('/content');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      <div className="w-full p-6">
        <nav className="mb-6">
          <ul className="flex items-center justify-between rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-2">
            <li className="flex-1 text-center">
              <span
                className={`inline-block px-5 py-2 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                  isAddCourse
                    ? 'bg-blue-600 text-white shadow-md dark:bg-blue-500'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Course Details
              </span>
            </li>

            <li className="flex-1 text-center">
              <span
                className={`inline-block px-5 py-2 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                  isContent
                    ? 'bg-blue-600 text-white shadow-md dark:bg-blue-500'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Course Content
              </span>
            </li>
          </ul>
        </nav>

        {children}
      </div>
    </div>
  );
};

export default CourseLayout;
