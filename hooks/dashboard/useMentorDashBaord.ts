import { getMentorData } from '@/services/apis/dashboard';
import { useQuery } from '@tanstack/react-query';

const useMentorDashBoard = () => {
  const {
    data = {
      courses: [],
      stats: {
        courses: 0,
        students: 0,
        pendingReviews: 0,
      },
    },
    isPending,
  } = useQuery<{
    courses: [];
    stats: {
      courses: number;
      students: number;
      pendingReviews: number;
    };
  }>({
    queryKey: ['mentor-dashboard'],
    queryFn: getMentorData,
  });

  return {
    dashBoardData: data,
    isPending,
  };
};

export default useMentorDashBoard;
