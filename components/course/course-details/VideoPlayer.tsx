import { useState } from 'react';
import { getEmbedUrl } from '@/utils/embeded-url';

type Lesson = {
  id: string;
  title: string;
  url: string | null;
};

const isYouTubeUrl = (url: string) => url.includes('youtube.com') || url.includes('youtu.be');
const isVideoFile = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

type VideoPlayerProps = {
  lesson: Lesson | null | undefined;
};

type YouTubePlayerProps = {
  url: string;
  lessonId: string;
  onLoad: () => void;
  isLoading: boolean;
};

export function VideoPlayer({ lesson }: VideoPlayerProps) {
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  if (!lesson?.url) {
    return <EmptyPlayerState />;
  }

  return (
    <div className="rounded-3xl overflow-hidden bg-white dark:bg-gray-900 shadow-xl border border-gray-200/50 dark:border-gray-800">
      <PlayerHeader title={lesson.title} />

      <div className="aspect-video bg-black">
        {isYouTubeUrl(lesson.url) && (
          <YouTubePlayer
            url={lesson.url}
            lessonId={lesson.id}
            onLoad={() => setIsVideoLoading(false)}
            isLoading={isVideoLoading}
          />
        )}

        {isVideoFile(lesson.url) && (
          <video key={lesson.id} controls className="w-full h-full">
            <source src={lesson.url} />
          </video>
        )}

        {!isYouTubeUrl(lesson.url) && !isVideoFile(lesson.url) && (
          <ExternalLinkPlayer url={lesson.url} />
        )}
      </div>
    </div>
  );
}

const PlayerHeader = ({ title }: { title: string }) => (
  <div className="p-4 sm:p-6 bg-gray-100 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-gray-500/40 flex items-center justify-center">
        <PlayIcon />
      </div>
      <div>
        <h2 className="font-semibold text-gray-900">{title || 'Select a lesson to start'}</h2>
        {title && <p className="text-xs text-gray-500 dark:text-gray-400">Now playing</p>}
      </div>
    </div>
  </div>
);

const YouTubePlayer = ({ url, lessonId, onLoad, isLoading }: YouTubePlayerProps) => (
  <div className="relative w-full h-full">
    {isLoading && <LoadingSpinner />}
    <iframe
      key={lessonId}
      src={getEmbedUrl(url)}
      className="w-full h-full"
      allow="autoplay; encrypted-media"
      allowFullScreen
      onLoad={onLoad}
    />
  </div>
);

const ExternalLinkPlayer = ({ url }: { url: string }) => (
  <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white">
    <p className="text-sm text-white/70">This lesson is hosted externally</p>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
    >
      Open Course
    </a>
  </div>
);

const EmptyPlayerState = () => (
  <div className="rounded-3xl overflow-hidden bg-white dark:bg-gray-900 shadow-xl border border-gray-200/50 dark:border-gray-800">
    <PlayerHeader title="" />
    <div className="aspect-video bg-black flex flex-col items-center justify-center">
      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
        <PlayIcon className="w-10 h-10 text-white/50" />
      </div>
      <p className="text-white/60 font-medium">Select a lesson to play</p>
    </div>
  </div>
);

const PlayIcon = ({ className = 'w-5 h-5 text-indigo-600 dark:text-indigo-500' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const LoadingSpinner = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
    <div className="flex items-center gap-3 text-white/80">
      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      Loading video...
    </div>
  </div>
);
