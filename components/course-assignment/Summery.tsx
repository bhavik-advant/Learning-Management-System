import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import Image from 'next/image';

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
  status: string;
  authorId: string;
  thumbnailId: string | null;
  createdAt: string;
  updatedAt: string;
  modulesCount: number;
};

type SummeryProps = {
  selectedCourses: Course[];
  selectedTraineeId: string;
  onAction: () => Promise<void>;
  actionLabel?: string;
  title?: string;
};

const Summery = ({
  selectedCourses,
  selectedTraineeId,
  onAction,
  actionLabel = 'Assign',
  title = 'Selected',
}: SummeryProps) => {
  const handleAction = async () => {
    await onAction();
  };

  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-8 h-fit shadow-md border border-border">
        <CardHeader className="py-2 px-4 border-b border-border">
          <CardTitle className="text-sm">{title}</CardTitle>
          <CardDescription className="text-xs">{selectedCourses.length} course(s)</CardDescription>
        </CardHeader>
        <CardContent className="pt-2 px-4 pb-4">
          {selectedCourses.length > 0 ? (
            <div className="space-y-2">
              <div className="space-y-1 max-h-56 overflow-y-auto">
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
                className="w-full bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg text-white text-xs font-medium py-1.5 px-3 rounded transition-all mt-2"
              >
                {actionLabel}
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
