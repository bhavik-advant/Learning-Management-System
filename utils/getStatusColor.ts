const getStatusColor = (status: string, isSelected = false as boolean) => {
  switch (status) {
    case 'GRADED':
      return `${
        isSelected
          ? 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300'
          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      } hover:bg-green-200 hover:text-green-800 dark:hover:bg-green-900/50 dark:hover:text-green-300`;
    case 'RESUBMITTED':
      return `${
        isSelected
          ? 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300'
          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      } hover:bg-red-200 hover:text-red-800 dark:hover:bg-red-900/50 dark:hover:text-red-300`;
    case 'PENDING':
      return `${
        isSelected
          ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      } hover:bg-yellow-200 hover:text-yellow-800 dark:hover:bg-yellow-900/50 dark:hover:text-yellow-300`;
    default:
      return `${
        isSelected
          ? 'bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
          : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
      } hover:bg-gray-300 hover:text-gray-800 dark:hover:bg-gray-600 dark:hover:text-gray-200`;
  }
};

export default getStatusColor;
