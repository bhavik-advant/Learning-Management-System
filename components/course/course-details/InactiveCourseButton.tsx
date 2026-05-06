'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';

import queryClient from '@/utils/query-client';
import { inactiveCourse } from '@/services/apis/courses';

export default function InactiveCourseButton({ courseId }: { courseId: string }) {
  const { mutate, isPending } = useMutation({
    mutationFn: inactiveCourse,

    onSuccess: () => {
      //   toast.success('Course marked as inactive');

      queryClient.invalidateQueries({
        queryKey: ['courses', courseId],
      });

      queryClient.invalidateQueries({
        queryKey: ['courses'],
      });
    },

    onError: (error: Error) => {
      //   toast.error(error.message);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="rounded-xl">
          Inactive
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Inactive this course?</AlertDialogTitle>

          <AlertDialogDescription>
            This course will be hidden from users. You can restore it later from admin panel.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction disabled={isPending} onClick={() => mutate(courseId)}>
            {isPending ? 'Updating...' : 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
