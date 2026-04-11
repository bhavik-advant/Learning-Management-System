export type SubmissionType = {
  id: string;
  fileId: string;
  score?: number;
  feedback: string;
  isActive: boolean;
  submittedAt: string;
  assignmentId: string;
  studentId: string;
};

type Props = {
  submissions: SubmissionType[];
  maxScore: number;
};

export default function SubmissionHistory({ submissions, maxScore }: Props) {
  return (
    <div className="mt-8 space-y-5">
      <h2 className="text-2xl font-semibold">Submission History</h2>

      {submissions.length === 0 ? (
        <div className="text-gray-500">No submissions yet.</div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission, index) => (
            <div
              key={submission.id}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm bg-white dark:bg-gray-900"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">Submission #{index + 1}</h3>
                  <p className="text-sm text-gray-500">
                    Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">
                    {submission?.score}
                    <span className="text-sm text-gray-500"> / {maxScore}</span>
                  </p>

                  <span
                    className={`inline-block mt-1 px-3 py-1 text-xs rounded-full ${
                      submission.score
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {submission.score ? 'Graded' : 'Pending'}
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-gray-100 dark:bg-gray-800 p-4">
                <p className="font-medium text-sm mb-1">Feedback:</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{submission.feedback}</p>
              </div>

              <div className="mt-3">
                <a href="#" className="text-sm text-purple-600 hover:underline">
                  View Submitted File
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
