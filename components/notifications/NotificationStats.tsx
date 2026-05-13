type NotificationStatsProps = {
    unreadCount: number;
    linkCount: number;
  };
  
  export const NotificationStats = ({ unreadCount, linkCount }: NotificationStatsProps) => {
    return (
      <div className="flex gap-4">
        <div className="rounded-2xl bg-white dark:bg-gray-800 px-6 py-4 shadow-sm">
          <p className="text-3xl font-bold">{unreadCount}</p>
          <p className="text-sm text-gray-500">Unread</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-800 px-6 py-4 shadow-sm">
          <p className="text-3xl font-bold">{linkCount}</p>
          <p className="text-sm text-gray-500">With links</p>
        </div>
      </div>
    );
  };