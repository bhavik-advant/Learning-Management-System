'use client';

import { useApproveCourse } from '@/hooks/courses/useApproveCourse';

export default function ApproveButton({ courseId }: { courseId: string }) {
  const { approve, isPending } = useApproveCourse(courseId);
  return (
    <button
      onClick={approve}
      disabled={isPending}
      className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-green-700 transition disabled:opacity-50"
    >
      {isPending ? 'Approving...' : '✓ Approve'}
    </button>
  );
}
