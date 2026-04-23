import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Mail, Calendar } from 'lucide-react';

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

type TraineeType = {
  username: string;
  email: string;
  role: string;
  image?: string | null;
  createdAt: string;
};

type Props = {
  traineeDetails: TraineeType | null;
};

const TraineeDetails = ({ traineeDetails }: Props) => {
  return (
    <div className="lg:col-span-1">
      {traineeDetails ? (
        <Card className="p-0 shadow-md border border-border">
          <CardHeader className="bg-linear-to-r from-blue-50 to-transparent dark:from-blue-950/30 dark:to-transparent border-b border-border p-0 m-0">
            <div className="flex items-start justify-between gap-3 p-4 pb-2">
              <div className="flex items-start gap-3  ">
                <Avatar className="h-12 w-12 border-2 border-blue-200 dark:border-blue-800">
                  <AvatarImage src={traineeDetails.image ?? ''} alt={traineeDetails.username} />
                  <AvatarFallback className="text-lg">{traineeDetails.username}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{traineeDetails.username}</CardTitle>
                  <div className="mt-1.5">
                    <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
                      {traineeDetails.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-2 px-4  pb-4 space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-xs text-foreground">{traineeDetails.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-xs text-foreground">
                Joined {formatDate(traineeDetails.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-dashed border-border shadow-sm flex items-center justify-center h-full">
          <CardContent className="text-center space-y-2 py-8">
            <Users className="w-10 h-10 text-muted-foreground mx-auto opacity-40" />
            <div>
              <p className="text-sm font-semibold text-foreground">Select a trainee</p>
              <p className="text-xs text-muted-foreground">
                Choose a trainee from the list to view their details
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TraineeDetails;
