'use client';

import { usePathname } from 'next/navigation';

const CourseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const path = usePathname();

  const isAddCourse = path.includes('/add-course');
  const isContent = path.includes('/content');
  const isAssignment = path.includes('/assignment');

  return (
    <div className="bg-gray-50">
      <div className="w-full p-6">
        <nav className="mb-4">
          <ul className="flex justify-between items-center bg-white rounded-2xl shadow-md p-4">
            <li className="flex-1 text-center">
              <span
                className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
                  isAddCourse ? 'text-blue-600 bg-blue-100' : 'text-gray-500 bg-blue-50'
                }`}
              >
                Course Details
              </span>
            </li>

            <li className="flex-1 text-center">
              <span
                className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
                  isContent ? 'text-blue-600 bg-blue-100' : 'text-gray-500 bg-blue-50'
                }`}
              >
                Course Content
              </span>
            </li>

            <li className="flex-1 text-center">
              <span
                className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
                  isAssignment ? 'text-blue-600 bg-blue-100' : 'text-gray-500 bg-blue-50'
                }`}
              >
                Assignments
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
