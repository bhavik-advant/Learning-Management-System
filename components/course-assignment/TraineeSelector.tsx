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
  return (
    <div className="lg:col-span-1 space-y-3 h-full flex flex-col">
      <Card className="shadow-md border border-border">
        <CardHeader className="border-b border-border py-2 px-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <CardTitle className="text-sm">Select Trainee</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Choose from {trainees.length} trainees
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-3 px-4 pb-4">
          <Select value={selectedTraineeId} onValueChange={onTraineeSelect}>
            <SelectTrigger className="w-full">
              <span className="text-muted-foreground">Choose a trainee...</span>
            </SelectTrigger>
            <SelectContent>
              {trainees.map(trainee => (
                <SelectItem
                  key={trainee.id}
                  value={trainee.id}
                  textValue={`${trainee.username} ${trainee.email}`}
                >
                  <div className="flex items-center gap-2 ">
                    <Avatar className="h-6 w-6 ">
                      <AvatarImage src={trainee.image ?? ''} alt={trainee.username} />
                      <AvatarFallback>{trainee.username}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-medium">{trainee.username}</span>
                      <span className="text-xs text-muted-foreground">{trainee.email}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
};

export default TraineeSelector;
