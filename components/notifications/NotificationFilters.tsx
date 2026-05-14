import { useDeleteNotifications } from '@/hooks/notification/useDeleteNotifications';
import { useMarkNotificationsAsRead } from '@/hooks/notification/useMarkNotificationsAsRead';
import { Bell, Mail, Inbox, Filter, CheckCheck, Trash } from 'lucide-react';
import { useState } from 'react';
import { BiTrash } from 'react-icons/bi';
import DeleteConfirmation from '../course/DeleteConfimation';
import Pending from '../course/Pending';


export type NotificationFilterType = 'all' | 'read' | 'unread';

type NotificationFiltersProps = {
  selectedNotifications: string[];
  selectMultiple: boolean;
  enableMultipleSelect: () => void;
  selectedFilter: NotificationFilterType;
  onFilterChange: (filter: NotificationFilterType) => void;
  unreadCount: number;
  readCount: number;
};

const NotificationFilters = ({
  selectedNotifications,
  selectMultiple,
  enableMultipleSelect,
  selectedFilter,
  onFilterChange,
  unreadCount,
  readCount,
}: NotificationFiltersProps) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const { deleteNotifications, isPending } = useDeleteNotifications({
    notificationIds: selectedNotifications,
  });

  const { markNotificationsAsRead, isMarkingAllAsRead } = useMarkNotificationsAsRead({
    notificationIds: selectedNotifications,
  });

  const handleDeleteSelectedNotifications = async () => {
    if (selectedNotifications.length === 0) return;
    await deleteNotifications({ deleteAll: false });
    enableMultipleSelect();
  };

  const handleMarkSelectedAsRead = async () => {
    if (selectedNotifications.length === 0) return;
    await markNotificationsAsRead({ markReadAll: false });
    enableMultipleSelect();
  };

  const isDisable = isPending || isMarkingAllAsRead;

  return (
    <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-6">
        <button
          onClick={() => onFilterChange('all')}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all ${
            selectedFilter === 'all'
              ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
              : 'bg-transparent'
          }`}
        >
          <Bell className="h-4 w-4" />
          All
        </button>

        <button
          onClick={() => onFilterChange('unread')}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all ${
            selectedFilter === 'unread'
              ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
              : 'bg-transparent'
          }`}
        >
          <Mail className="h-4 w-4" />
          Unread
          <span>{unreadCount}</span>
        </button>

        <button
          onClick={() => onFilterChange('read')}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all ${
            selectedFilter === 'read'
              ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
              : 'bg-transparent'
          }`}
        >
          <Inbox className="h-4 w-4" />
          Read
          <span>{readCount}</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-8">
        {selectMultiple ? (
          <>
            <button
              onClick={enableMultipleSelect}
              disabled={isDisable}
              className="flex items-center gap-2 text-base font-medium"
            >
              Cancel
            </button>
            {selectedFilter == 'unread' && (
              <button
                disabled={isDisable}
                onClick={handleMarkSelectedAsRead}
                className="flex items-center gap-2 text-base font-medium"
              >
                {isMarkingAllAsRead ? (
                  <Pending />
                ) : (
                  <CheckCheck className="h-5 w-5 text-gray-500" />
                )}
                Mark Selected as Read
              </button>
            )}
            <button
              disabled={isDisable}
              onClick={handleDeleteSelectedNotifications}
              className="flex items-center gap-2 text-base font-medium"
            >
              {isPending ? <Pending /> : <BiTrash className="h-5 w-5 text-gray-500" />}
              Delete Selected
            </button>
          </>
        ) : (
          <button
            onClick={enableMultipleSelect}
            disabled={isDisable}
            className="flex items-center gap-2 text-base font-medium"
          >
            <Filter className="h-5 w-5 text-gray-500" />
            Select
          </button>
        )}

        {!selectMultiple && (
          <>
            {selectedFilter === 'unread' && (
              <button
                disabled={isDisable}
                onClick={async () => await markNotificationsAsRead({ markReadAll: true })}
                className="flex items-center gap-2 text-base font-medium"
              >
                {isMarkingAllAsRead ? (
                  <Pending />
                ) : (
                  <CheckCheck className="h-5 w-5 text-gray-500" />
                )}
                Mark all read
              </button>
            )}

            <button
              disabled={isDisable}
              onClick={() => setShowDeleteConfirmation(true)}
              className="flex items-center gap-2 text-base font-medium"
            >
              {isPending ? <Pending /> : <BiTrash className="h-5 w-5 text-gray-500" />}
              Delete all
            </button>
          </>
        )}
      </div>

      {showDeleteConfirmation && (
        <DeleteConfirmation
          onConfirm={async () => {
            await deleteNotifications({ deleteAll: true });
          }}
          isPending={isPending}
          itemType="notifications"
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
    </div>
  );
};

export default NotificationFilters;
