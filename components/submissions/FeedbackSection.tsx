'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updateFeedback } from '@/services/apis/submissions';
import queryClient from '@/utils/query-client';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { SubmissionStatus } from '@/generated/prisma/enums';

interface FeedbackSectionProps {
  feedback: string | null | undefined;
  submissionId: string;
  maxScore: number;
  onFeedbackSubmitted?: () => void;
  score: number | null;
}

const FeedbackSection = ({
  feedback,
  submissionId,
  maxScore,
  onFeedbackSubmitted,
  score: incomingScore,
}: FeedbackSectionProps) => {
  const [isEditing, setIsEditing] = useState(!feedback);
  const [feedbackText, setFeedbackText] = useState(feedback || '');
  const [score, setScore] = useState<number | null>(incomingScore ?? null);
  const [formError, setFormError] = useState<string>('');

  const { mutateAsync: submitFeedback, isPending } = useMutation({
    mutationFn: updateFeedback,
    onSuccess: () => {
      setIsEditing(false);
      queryClient.setQueryData(['submission', submissionId], old => {
        if (!old) {
          return old;
        }

        return {
          ...old,
          status: SubmissionStatus.GRADED,
          feedback: feedbackText,
          score: score,
        };
      });
      onFeedbackSubmitted?.();
    },
    onError: error => {
      setFormError(error instanceof Error ? error.message : 'Failed to save feedback');
    },
  });

  const handleSubmit = async () => {
    setFormError('');

    if (!feedbackText.trim()) {
      setFormError('Feedback cannot be empty');
      return;
    }

    if (score !== null && (score < 0 || score > maxScore)) {
      setFormError(`Score must be between 0 and ${maxScore}`);
      return;
    }

    await submitFeedback({
      feedback: feedbackText,
      score,
      submissionId,
    });
  };

  if (feedback && !isEditing) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold mb-2">Feedback</CardTitle>
            <Button
              onClick={() => setIsEditing(true)}
              variant="link"
              className="text-blue-500 hover:text-blue-600"
            >
              Edit
            </Button>
          </div>
          <p className="text-base whitespace-pre-wrap text-gray-700 dark:text-gray-300">
            {feedback}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">
          {feedback ? 'Edit Feedback' : 'Provide Feedback'}
        </h2>

        <div className="space-y-4">
          {formError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-700 dark:text-red-300">{formError}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Feedback</label>
            <textarea
              value={feedbackText}
              onChange={e => {
                setFeedbackText(e.target.value);
                if (formError) setFormError('');
              }}
              placeholder="Enter your feedback for the student..."
              className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Score (Optional)</label>
              <input
                type="number"
                value={score ?? 0}
                onChange={e => {
                  const val = e.target.value ? parseInt(e.target.value) : null;
                  setScore(val);
                  if (formError) setFormError('');
                }}
                placeholder="Enter score"
                min="0"
                max={maxScore}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Max: {maxScore}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!feedback) {
                    setFeedbackText('');
                    setScore(null);
                  } else {
                    setIsEditing(false);
                  }
                  setFormError('');
                }}
                disabled={isPending}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending || !feedbackText.trim()}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Feedback'
                )}
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackSection;
