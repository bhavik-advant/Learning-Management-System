import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const NoCourses = ({ title }: { title: string }) => {
  return (
    <Card className="shadow-md dark:bg-[#0b111f] border border-border">
      <CardHeader className="border-b border-border py-2 px-4">
        <CardTitle className="text-sm"> {title}</CardTitle>
        <CardDescription className="text-xs">Viewing 0 course(s)</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex items-center justify-center min-h-64">
        <div className="text-center space-y-2">
          <Users className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
          <div>
            <p className="text-sm font-semibold text-foreground">No courses assigned</p>
            <p className="text-xs text-muted-foreground">
              This trainee has no assigned courses yet.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoCourses;
