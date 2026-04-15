'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveCourse } from '@/services/apis/courses';

export default function ApproveButton({ courseId }: { courseId: string }) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: approveCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingCourses'] });
      queryClient.invalidateQueries({ queryKey: ['courses', courseId] });
    },
  });

  const handleApprove = (id: string) => {
    mutate(id);
  };
  return (
    <button
      onClick={() => handleApprove(courseId)}
      disabled={isPending}
      className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-green-700 transition disabled:opacity-50"
    >
      {isPending ? 'Approving...' : '✓ Approve'}
    </button>
  );
}
