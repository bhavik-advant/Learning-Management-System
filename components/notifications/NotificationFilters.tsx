import { Bell, Mail, Inbox, Filter, CheckCheck } from 'lucide-react';
// import { NotificationFilter } from '@/types/notification';

export type NotificationFilterType = 'all' | 'read' | 'unread';

type NotificationFiltersProps = {
  selectedFilter: NotificationFilterType;
  onFilterChange: (filter: NotificationFilterType) => void;
  unreadCount: number;
  readCount: number;
};

const NotificationFilters = ({
  selectedFilter,
  onFilterChange,
  unreadCount,
  readCount,
}: NotificationFiltersProps) => {
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
        <button className="flex items-center gap-2 text-base font-medium">
          <Filter className="h-5 w-5 text-gray-500" />
          Select
        </button>

        <button className="flex items-center gap-2 text-base font-medium">
          <CheckCheck className="h-5 w-5 text-gray-500" />
          Mark all read
        </button>
      </div>
    </div>
  );
};

export default NotificationFilters;
