type CourseStatsProps = {
  modulesCount: number;
  totalLessons: number;
};

export function CourseStats({ modulesCount, totalLessons }: CourseStatsProps) {
  return (
    <div className="flex gap-4">
      <StatCard value={modulesCount} label="Modules" />
      <StatCard value={totalLessons} label="Lessons" />
    </div>
  );
}

const StatCard = ({ value, label }: { value: number; label: string }) => (
  <div className="flex-1 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);
