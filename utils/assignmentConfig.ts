export const STATUS_STYLES: Record<string, string> = {
  Submitted: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
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
