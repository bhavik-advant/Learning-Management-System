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
import { useReactivateCourse } from '@/hooks/courses/useReactivateCourse';

export default function ReactivateCourseButton({ courseId }: { courseId: string }) {
  const { mutate, isPending } = useReactivateCourse(courseId);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          disabled={isPending}
          className="
            flex items-center justify-center gap-2
            px-4 py-2 rounded-xl
            bg-green-50 dark:bg-green-900/80
            border border-green-200 dark:border-green-800
            text-green-600 dark:text-green-400
            font-medium text-sm
            hover:bg-green-100 dark:hover:bg-green-900/90
            transition-all duration-200
            cursor-pointer
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Reactivating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reactivate
            </>
          )}
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reactivate this course?</AlertDialogTitle>

          <AlertDialogDescription>
            This course will become visible to users again.
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
