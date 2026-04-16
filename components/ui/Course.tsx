import Image from 'next/image';
import Link from 'next/link';

const Course: React.FC<{
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
  status: string;
  authorId: string;
  thumbnailId: string | null;
  createdAt: string;
  modulesCount: number;
  authorInitials?: string;
  btnText: string;
  progress?: number; // 0–100
  btnVariant?: 'dark' | 'coral' | 'blue';
}> = ({
  id,
  thumbnail,
  title,
  author,
  status,
  createdAt,
  modulesCount,
  authorInitials,
  btnText,
  description,
  progress,
  btnVariant = 'dark',
}) => {
  const derivedInitials = (authorInitials ?? author)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('');

  const statusColors: Record<string, string> = {
    APPROVED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    DRAFT: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    REJECTED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
  };

  const statusColor = statusColors[status] || statusColors.DRAFT;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const btnColors = {
    dark: 'bg-gray-900 text-white hover:bg-gray-700',
    coral: 'bg-orange-600 text-white hover:bg-orange-700',
    blue: 'bg-blue-700  text-white hover:bg-blue-800',
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border-2 border-gray-400/50 dark:border-gray-800 bg-white/70 dark:bg-gray-950/40 backdrop-blur-xl shadow-sm transition hover:-translate-y-1 hover:shadow-md">

   
      <div className="relative h-52 overflow-hidden">
        <Image
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          src={thumbnail}
          alt={title}
          fill
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/60" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-black/20 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-white">
            Preview
          </span>
        </div>
      </div>

     
      <div className="relative p-6 space-y-4">
        
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide rounded-full border ${statusColor}`}>
              {status}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {modulesCount}
            </span>
          
          </div>
        </div>

        
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/60 dark:bg-gray-950/30 text-gray-900 dark:text-white flex items-center justify-center text-[10px] font-semibold flex-shrink-0">
            {derivedInitials}
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate">{author}</span>
        </div>

        <h2 className="text-[18px] font-semibold leading-snug text-gray-900 dark:text-white line-clamp-2">
          {title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{description}</p>

        
        {progress !== undefined && (
          <div>
            <p className="text-[11px] text-gray-400 mb-1">Your progress — {progress}%</p>
            <div className="h-[3px] rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div className="h-full bg-green-600 rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        
        <div className="flex items-center justify-between pt-1">
          <Link
            href={`courses/${id}`}
            className={`text-sm font-medium px-4 py-2 rounded-2xl transition-colors duration-200 ${
              btnVariant === 'dark'
                ? 'bg-gray-900 text-white hover:opacity-90'
                : btnColors[btnVariant]
            }`}
          >
            {btnText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Course;
