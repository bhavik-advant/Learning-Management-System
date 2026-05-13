export const NotificationSkeleton = () => {
    return (
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="space-y-4 p-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex animate-pulse items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-800/50"
            >
              <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1">
                <div className="h-4 w-3/4 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="mt-3 h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800" />
                <div className="mt-2 h-3 w-5/6 rounded-full bg-gray-100 dark:bg-gray-800" />
                <div className="mt-4 h-3 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };