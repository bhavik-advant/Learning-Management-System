import type { AssignmentType } from '@/services/apis/Assignments';

const Assignments: React.FC<{ assignments: AssignmentType[] }> = ({ assignments }) => {
  return (
    <div className="w-full overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 my-5">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
          <tr>
            <th className="px-6 py-3 font-medium">Assignment</th>
            <th className="px-6 py-3 font-medium">Due Date</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map(item => (
            <tr
              key={item.id}
              className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <td className="px-6 py-4">
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </td>

              <td
                className={`px-6 py-4 ${new Date(item.dueDate) < new Date() ? 'text-red-500' : ''}`}
              >
                {item.dueDate}
              </td>

              <td className="px-6 py-4">
                <span className="px-3 py-1 text-xs rounded-full bg-gray-900 text-white">
                  {item.status}
                </span>
              </td>

              <td className="px-6 py-4 text-right">
                <button className="bg-gray-900 text-white px-4 py-1.5 rounded-md hover:bg-gray-800 text-sm">
                  Submit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {assignments.length === 0 && (
        <div className="text-center py-10 text-gray-500">No assignments found</div>
      )}
    </div>
  );
};

export default Assignments;
