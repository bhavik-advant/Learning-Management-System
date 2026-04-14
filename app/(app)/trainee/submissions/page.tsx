import AssignmentCards from '@/components/assignments/AssignmentCards';
import Submissions from '@/components/submissions/Submissions';
// import { getAllAssignments } from '@/services/apis/Assignments';
import { getAllSubmissions, getSubmissionsByStudent } from '@/services/apis/submissions';
import { FaRegFileAlt } from 'react-icons/fa';

export default async function SubmissionsPage() {
  // const assignment = getAllAssignments();
  const submissions = getAllSubmissions();

  return (
    <section className="mx-8 space-y-5 mt-5">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Submissions</h1>
        <p>Explore and Submit Submissions</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <AssignmentCards
          title="Total Submissions"
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
        <Submissions submissions={submissions} />
      </div>
    </section>
  );
}
