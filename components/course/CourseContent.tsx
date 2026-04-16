'use client';

import Modules from '@/components/course/Modules';
import NewModule from '@/components/course/NewModule';
import { Role } from '@/generated/prisma/enums';
import { getCourseById, saveCourse } from '@/services/apis/courses';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';

type Lesson = {
  id: string;
  title: string;
  url: string;
};

type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

const AddContent = ({ role }: { role: Role }) => {
  const router = useRouter();
  const { id: courseId } = useParams<{ id: string }>();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: saveCourse,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => getCourseById(courseId),
  });

  if (isLoading) {
    return <p>Loading....</p>;
  }

  const handleSaveCourse = async () => {
    const response = await mutateAsync(courseId);

    if (response.success == true && response.statusCode == 201) {
      router.push(`/${role.toLowerCase()}/courses`);
    }
  };

  return (
    <>
      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-black/40 p-8 transition-colors duration-300">
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100">Add Content</h2>

        <div className="space-y-5 mt-4">
          {data &&
            data.data &&
            data.data.modules &&
            data.data.modules.map((module: Module) => (
              <Modules
                key={module.id}
                id={module.id}
                title={module.title}
                lessons={module.lessons}
              />
            ))}
        </div>

        <div className="mt-6">
          <NewModule />
        </div>

        <div className="flex justify-end mt-4  gap-4">
          <button className='py-1 px-2 rounded-md border text-gray-500 bg-gray-300/20 border-gray-400'>Back</button>
          <button
            onClick={handleSaveCourse}
            className="py-1 px-2 rounded-md border text-green-500 bg-green-300/20 border-green-400"
            disabled={isPending}
          >
            {isPending ? 'Saving' : 'Save Course'}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddContent;
