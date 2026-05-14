const DeleteConfirmation: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
  itemType: string;
  isPending: boolean;
}> = ({ onConfirm, onCancel, itemType, isPending }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-6">Are you sure you want to delete {itemType}?</p>
        <div className="flex justify-end gap-4">
          <button
            disabled={isPending}
            onClick={onCancel}
            className="bg-gray-300/50 dark:bg-gray-500/30 px-4 py-2 rounded-lg hover:bg-gray-300/70 dark:hover:bg-gray-500/50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500/20 dark:bg-red-500/10 px-4 py-2 rounded-lg hover:bg-red-500/30 dark:hover:bg-red-500/20 transition"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
