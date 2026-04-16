'use client';
import { getAllTrainee } from '@/services/apis/users';
import { useQuery } from '@tanstack/react-query';

const Page = () => {
  //after Trainee Mentor Realtionship Table
  // const { data, isLoading } = useQuery({
  //   queryKey: ['users'],
  //   queryFn: getAllTrainee,
  // });

  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }

  // console.log(data);

  return <p>Hello Bachho</p>;
};

export default Page;
