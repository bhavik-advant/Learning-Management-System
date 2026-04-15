import Image from 'next/image';
import Link from 'next/link';
import ApproveButton from '../ui/ApproveButton';

type CourseType = {
  id: string;
  title: string;
  description: string;
  mentor: string;
  submittedAt: string;
  modules: number;
  lessons: number;
  image: string | null;
};

type Props = {
  courses: CourseType[];
};

export default function ApprovalTable({ courses }: Props) {
  return (
    <div className="w-full overflow-auto rounded-2xl border border-gray-200 dark:border-gray-700 my-5 shadow-sm bg-white/70 dark:bg-gray-900/60 backdrop-blur">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100/70 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300">
          <tr>
            <th className="px-6 py-3 font-medium">Course</th>
            <th className="px-6 py-3 font-medium">Mentor</th>
            <th className="px-6 py-3 font-medium">Submitted</th>
            <th className="px-6 py-3 font-medium">Content</th>
            <th className="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {courses.map(course => (
            <tr
              key={course.id}
              className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50/70 dark:hover:bg-gray-800/60 transition"
            >
              <td className="px-6 py-4 flex items-center gap-4">
                <div className="w-22 h-14 relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-200">
                  <Image
                    src={course.image || '/default-course.png'}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="font-semibold">{course.title}</p>
                </div>
              </td>

              <td className="px-6 py-4">
                <p className="font-medium">{course.mentor}</p>
              </td>

              <td className="px-6 py-4">
                <p>{new Date(course.submittedAt).toLocaleDateString()}</p>
              </td>

              <td className="px-6 py-4">
                <p className="font-medium">{course.modules} modules</p>
                <p className="text-gray-500 text-sm">{course.lessons} lessons</p>
              </td>

              <td className="px-6 py-4 text-right">
                <ApproveButton courseId={course.id} />
                <Link href={`courses/${course.id}`}>View Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {courses.length === 0 && (
        <div className="text-center py-12 text-gray-500">No pending approvals</div>
      )}
    </div>
  );
}
