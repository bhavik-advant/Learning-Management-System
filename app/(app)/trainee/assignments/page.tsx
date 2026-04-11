import AssignmentCards from '@/components/assignments/AssignmentCards';
import Assignments from '@/components/assignments/Assignments';
import { getAllAssignments } from '@/services/apis/Assignments';
import { FaRegFileAlt } from 'react-icons/fa';

export default async function CoursesPage() {
  const assignment = getAllAssignments();
  return (
    <section className="mx-8 space-y-5 mt-5">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Assignments</h1>
        <p>Explore and Submit Assignments</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <AssignmentCards
          title="Total Assignments"
          value="5"
          icon={<FaRegFileAlt className="text-blue-700" />}
        />
        <AssignmentCards
          title="Pending"
          value="2"
          icon={<FaRegFileAlt className="text-orange-700" />}
        />
        <AssignmentCards
          title="Completed"
          value="3"
          icon={<FaRegFileAlt className="text-green-800" />}
        />
      </div>
      <div>
        <Assignments assignments={assignment} />
      </div>
    </section>
  );
}
