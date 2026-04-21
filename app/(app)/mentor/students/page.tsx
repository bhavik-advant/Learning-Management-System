'use client';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { getAllTrainee } from '@/services/apis/users';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import TraineeSelector from '@/components/course-assignment/TraineeSelector';
import TraineeDetails from '@/components/course-assignment/TraineeDetails';
import AssignableCourses from '@/components/course-assignment/AssignableCourses';
import AssignedCourses from '@/components/course-assignment/AssignedCourses';
import queryClient from '@/utils/query-client';

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

const Page = () => {
  const [selectedTraineeId, setSelectedTraineeId] = useState('');
  const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    data: traineeData,
    isLoading,
    isError,
    error,
  } = useQuery<Trainee[], Error>({
    queryKey: ['users'],
    queryFn: getAllTrainee,
  });

  const trainees: Trainee[] = traineeData ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4 p-8">
        <div className="h-10 w-64 animate-pulse rounded-md bg-muted" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-max">
          <div className="lg:col-span-1 space-y-4">
            <div className="h-12 w-full animate-pulse rounded-lg bg-muted shadow-md" />
            <div className="h-64 animate-pulse rounded-lg bg-muted shadow-md" />
          </div>
          <div className="lg:col-span-2 h-96 animate-pulse rounded-lg bg-muted shadow-md" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <Card className="shadow-md border border-border">
          <CardHeader>
            <CardTitle>Unable to load trainees</CardTitle>
            <CardDescription>
              {error.message || 'Something went wrong while fetching trainees.'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleSelectTrainee = (value: string) => {
    setLoading(true);
    const trainee = trainees.find(user => user.id === value) ?? null;
    setSelectedTraineeId(value);
    setSelectedTrainee(trainee);
    queryClient.invalidateQueries({
      queryKey: ['assignable-courses', value],
    });
    queryClient.invalidateQueries({
      queryKey: ['assigned-courses', value],
    });
    setLoading(false);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">My Trainees</h1>
        <p className="text-sm text-muted-foreground">
          Select a trainee to view their details and manage their assignments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TraineeSelector
          trainees={trainees}
          selectedTraineeId={selectedTraineeId}
          onTraineeSelect={handleSelectTrainee}
        />
        <TraineeDetails traineeDetails={selectedTrainee} />
      </div>

      {!loading && !!selectedTraineeId && (
        <AssignableCourses selectedTraineeId={selectedTraineeId} />
      )}

      {!loading && !!selectedTraineeId && <AssignedCourses traineeId={selectedTraineeId} />}
    </div>
  );
};

export default Page;
