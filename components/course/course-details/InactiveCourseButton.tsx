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

import { Loader2 } from 'lucide-react';
import { useInactiveCourse } from '@/hooks/courses/useInactiveCourse';

export default function InactiveCourseButton({ courseId }: { courseId: string }) {
  const { mutate, isPending } = useInactiveCourse(courseId);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          disabled={isPending}
          className="
            flex items-center justify-center gap-2
            px-4 py-2 rounded-xl
            bg-red-50 dark:bg-red-900/80
            border border-red-200 dark:border-red-800
            text-red-600 dark:text-red-200
            font-medium text-sm
            hover:bg-red-100 dark:hover:bg-red-900/90
            transition-all duration-200
            cursor-pointer
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Inactive
            </>
          )}
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Inactivate this course?</AlertDialogTitle>

          <AlertDialogDescription>
            This course will be hidden from users. You can restore it later from the admin panel.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={isPending}
            onClick={() => mutate()}
            className="
              min-w-[120px]
              flex items-center justify-center gap-2
            "
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Confirm'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
