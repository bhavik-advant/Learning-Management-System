import { AssignmentList } from './AssignmentList';

type Lesson = {
  id: string;
  title: string;
  url: string | null;
};

type Submission = {
  status: 'PENDING' | 'GRADED' | 'RESUBMITTED';
  score: number | null;
};

type Assignment = {
  id: string;
  title: string;
  dueDate: string | null;
  submission?: Submission | null;
};

type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
  assignments: Assignment[];
};

type ModuleItemProps = {
  module: Module;
  moduleIndex: number;
  isExpanded: boolean;
  onToggle: () => void;
  currentLesson: Lesson | null;
  showSubmission: boolean;
  onLessonSelect: (lesson: Lesson) => void;
};

type LessonItemProps = {
  lesson: Lesson;
  lessonIndex: number;
  isActive: boolean;
  onSelect: () => void;
};

export function ModuleItem({
  module,
  moduleIndex,
  isExpanded,
  onToggle,
  currentLesson,
  showSubmission,
  onLessonSelect,
}: ModuleItemProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-300 to-blue-600/80 text-white flex items-center justify-center text-xs font-bold">
            {moduleIndex + 1}
          </span>
          <div className="text-left">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{module.title}</h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              {module.lessons.length} lessons
            </p>
          </div>
        </div>
        <ChevronIcon isExpanded={isExpanded} />
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100 dark:border-gray-800">
          {module.lessons.map((lesson, lessonIndex) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              lessonIndex={lessonIndex}
              isActive={currentLesson?.id === lesson.id}
              onSelect={() => onLessonSelect(lesson)}
            />
          ))}

          {module.assignments.length > 0 && (
            <AssignmentList assignments={module.assignments} showSubmission={showSubmission} />
          )}
        </div>
      )}
    </div>
  );
}

const LessonItem = ({ lesson, lessonIndex, isActive, onSelect }: LessonItemProps) => (
  <div
    onClick={onSelect}
    className={`p-3 flex items-center gap-3 cursor-pointer transition ${
      isActive
        ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500'
        : 'hover:bg-gray-50 dark:hover:bg-gray-800/30 border-l-4 border-transparent'
    }`}
  >
    <span
      className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center ${
        isActive
          ? 'bg-indigo-500 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
      }`}
    >
      {lessonIndex + 1}
    </span>
    <span className="flex-1 text-xs font-medium">{lesson.title}</span>
  </div>
);

const ChevronIcon = ({ isExpanded }: { isExpanded: boolean }) => (
  <svg
    className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);
