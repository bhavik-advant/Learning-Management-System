import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Trainee = {
  id: string;
  clerkId: string;
  mentorId: string | null;
  role: string;
  username: string;
  email: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
};

const TraineeSelector = ({
  trainees,
  selectedTraineeId,
  onTraineeSelect,
}: {
  trainees: Trainee[];
  selectedTraineeId: string;
  onTraineeSelect: (traineeId: string) => void;
}) => {
  const hasTrainees = trainees.length > 0;

  return (
    <div className="lg:col-span-1 space-y-3 h-full flex flex-col">
      <Card className="shadow-md border border-border dark:bg-[#0b111f] dark:border-slate-800">
        <CardHeader className="border-b border-border py-2 px-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 dark:text-slate-400" />
            <CardTitle className="text-sm dark:text-slate-100">Select Trainee</CardTitle>
          </div>
          <CardDescription className="text-xs dark:text-slate-400">
            {hasTrainees
              ? `Choose from ${trainees.length} trainees`
              : 'You have not assigned any trainee'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-3 px-4 pb-4">
          {hasTrainees ? (
            <Select value={selectedTraineeId} onValueChange={onTraineeSelect}>
              <SelectTrigger className="w-full dark:bg-[#101828] dark:border-slate-700 dark:text-slate-100">
                <span className="text-muted-foreground dark:text-slate-400">Choose a trainee...</span>
              </SelectTrigger>
              <SelectContent className="dark:bg-[#101828] dark:border-slate-700">
                {trainees.map(trainee => (
                  <SelectItem
                    key={trainee.id}
                    value={trainee.id}
                    textValue={`${trainee.username} ${trainee.email}`}
                    className="dark:hover:bg-[#1a222f] dark:focus:bg-[#1a222f]"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={trainee.image ?? ''} alt={trainee.username} />
                        <AvatarFallback className="dark:bg-[#0b111f] dark:text-slate-100">{trainee.username}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm font-medium dark:text-slate-100">{trainee.username}</span>
                        <span className="text-xs text-muted-foreground dark:text-slate-400">{trainee.email}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-muted-foreground dark:text-slate-400">You have not assigned any trainee</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TraineeSelector;
