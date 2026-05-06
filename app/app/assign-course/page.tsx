'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAssignableUsers } from '@/services/apis/users';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import TraineeSelector from '@/components/course-assignment/TraineeSelector';
import TraineeDetails from '@/components/course-assignment/TraineeDetails';
import AssignableCourses from '@/components/course-assignment/AssignableCourses';
import AssignedCourses from '@/components/course-assignment/AssignedCourses';
import queryClient from '@/utils/query-client';

type UserType = {
  id: string;
  clerkId: string;
  mentorId: string | null;
  role: 'TRAINEE' | 'MENTOR' | 'ADMIN';
  username: string;
  email: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
};

const AssignCoursePage = () => {
  const [selectedUserId, setSelectedUserId] = useState('');

  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const [loading, setLoading] = useState(false);

  const {
    data: usersData,
    isLoading,
    isError,
    error,
  } = useQuery<UserType[], Error>({
    queryKey: ['users'],
    queryFn: getAssignableUsers,
  });

  const users: UserType[] = usersData ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4 dark:bg-[#101828] min-h-screen p-8">
        <div className="h-10 dark:bg-[#0b111f] w-64 animate-pulse rounded-md bg-muted" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-max">
          <div className="lg:col-span-1 space-y-4">
            <div className="h-12 w-full animate-pulse rounded-lg dark:bg-[#0b111f] bg-muted shadow-md" />

            <div className="h-64 animate-pulse rounded-lg dark:bg-[#0b111f] bg-muted shadow-md" />
          </div>

          <div className="lg:col-span-2 h-96 animate-pulse rounded-lg dark:bg-[#0b111f] bg-muted shadow-md" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <Card className="shadow-md border border-border">
          <CardHeader>
            <CardTitle>Unable to load users</CardTitle>

            <CardDescription>
              {error.message || 'Something went wrong while fetching users.'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleSelectUser = (value: string) => {
    setLoading(true);

    const user = users.find(u => u.id === value) ?? null;

    setSelectedUserId(value);

    setSelectedUser(user);

    queryClient.invalidateQueries({
      queryKey: ['assignable-courses', value],
    });

    queryClient.invalidateQueries({
      queryKey: ['assigned-courses', value],
    });

    setLoading(false);
  };

  return (
    <div className="space-y-4 dark:bg-[#101828] min-h-screen p-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Assign Courses</h1>

        <p className="text-sm text-muted-foreground">
          Select a user (trainee or mentor) to manage course assignments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TraineeSelector
          trainees={users}
          selectedTraineeId={selectedUserId}
          onTraineeSelect={handleSelectUser}
        />

        <TraineeDetails traineeDetails={selectedUser} />
      </div>

      {!loading && selectedUserId && (
        <AssignableCourses key={`assignable-${selectedUserId}`} selectedUserId={selectedUserId} />
      )}

      {!loading && selectedUserId && (
        <AssignedCourses key={`assigned-${selectedUserId}`} selectedUserId={selectedUserId} />
      )}
    </div>
  );
};

export default AssignCoursePage;
