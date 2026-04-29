import { useState } from 'react';
import { ModuleItem } from './ModuleItem';

type Lesson = {
  id: string;
  title: string;
  content: string | null;
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

type ModuleListProps = {
  modules: Module[];
  currentLesson: Lesson | null;
  showSubmission: boolean;
  onLessonSelect: (lesson: Lesson) => void;
};

export function ModuleList({
  modules,
  currentLesson,
  showSubmission,
  onLessonSelect,
}: ModuleListProps) {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
      {modules.map((module, index) => (
        <ModuleItem
          key={module.id}
          module={module}
          moduleIndex={index}
          isExpanded={expandedModule === module.id}
          onToggle={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
          currentLesson={currentLesson}
          showSubmission={showSubmission}
          onLessonSelect={onLessonSelect}
        />
      ))}
    </div>
  );
}
