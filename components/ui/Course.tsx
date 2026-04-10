import Image from 'next/image';
import Link from 'next/link';

const Course: React.FC<{
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
  btnText: string;
}> = ({ id, thumbnail, title, author, btnText, description }) => {
  return (
    <div className="group rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative h-52 overflow-hidden">
        <Image
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          src={thumbnail}
          alt={title}
          fill
        />
      </div>

      <div className="p-5 space-y-3">
        <h2 className="text-lg font-semibold tracking-tight line-clamp-1">{title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{description}</p>
        <h4 className="text-sm">
          by <span className="font-medium text-gray-800 dark:text-gray-200">{author}</span>
        </h4>
        <Link
          className="inline-block w-full text-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 transition-colors duration-200"
          href={`courses/${id}`}
        >
          {btnText}
        </Link>
      </div>
    </div>
  );
};

export default Course;
