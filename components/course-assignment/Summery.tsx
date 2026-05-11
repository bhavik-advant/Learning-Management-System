import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, X } from 'lucide-react';
import Image from 'next/image';

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
  status: string;
  modulesCount: number;
};

type SummeryProps = {
  selectedCourses: Course[];
  userId?: string;
  onAction: () => Promise<void>;
  actionLabel?: string;
  title?: string;
  isLoading: boolean;
  pendingText: string;
  className?: string;
  onClose: () => void;
};

const Summery = ({
  onClose,
  selectedCourses,
  pendingText,
  isLoading,
  onAction,
  actionLabel = 'Assign',
  title = 'Selected Courses',
  className,
}: SummeryProps) => {
  const handleAction = async () => {
    await onAction();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 ">
      <Card className="relative h-fit shadow-md  border border-border min-w-120 dark:bg-[#0b111f]">
        <button className="absolute top-4 right-4 cursor-pointer" onClick={onClose}>
          <X />
        </button>
        <CardHeader className="py-2 px-4 border-b border-border">
          <CardTitle className="text-sm">{title}</CardTitle>
          <CardDescription className="text-xs">{selectedCourses.length} course(s)</CardDescription>
        </CardHeader>
        <CardContent className="pt-2 px-4 pb-4">
          {selectedCourses.length > 0 ? (
            <div className="space-y-2">
              <div className="space-y-1  overflow-y-auto">
                {selectedCourses.map(course => (
                  <div
                    key={course.id}
                    className="flex items-center gap-2 p-2 rounded border border-transparent hover:border-border hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-all"
                  >
                    <div className="relative w-16 h-16 rounded overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-700 shadow-sm border border-slate-300 dark:border-slate-600">
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground line-clamp-2">
                        {course.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAction}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg text-white text-xs font-medium py-1.5 px-3 rounded transition-all mt-2"
              >
                {isLoading ? pendingText : actionLabel}
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <Users className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
              <p className="text-xs font-medium text-foreground">No courses selected</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Summery;
