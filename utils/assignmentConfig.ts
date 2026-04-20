export const STATUS_STYLES: Record<string, string> = {
  NOT_SUBMITTED: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300',

  PENDING:
    'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300',

  GRADED: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300',

  RESUBMITTED: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
  TRAINEE: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  MENTOR: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  ADMIN: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

export const STATUS_BUTTON: Record<string, { text: string; className: string }> = {
  Submitted: {
    text: 'View',
    className:
      'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 cursor-pointer',
  },
  Pending: {
    text: 'Submit',
    className: 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer',
  },
};
