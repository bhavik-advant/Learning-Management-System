'use client';

import Modules from '@/components/course/Modules';
import NewModule from '@/components/course/NewModule';
import { Role } from '@/generated/prisma/enums';
import { getCourseById, saveCourse } from '@/services/apis/courses';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
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

  console.log(data);
  

  if (isLoading) {
    return <p>Loading....</p>;
  }

  const handleSaveCourse = async () => {
    const response = await mutateAsync(courseId);

    if (response?.success && response?.statusCode === 201) {
      router.push(`/${role.toLowerCase()}/courses`);
    }
  };

  return (
    <>
      <div className="relative h-full w-full overflow-hidden ">
        <div className="flex justify-end ">
          <button
            onClick={handleSaveCourse}
            className="py-1 px-2 text-md border border-gray-600/80 text-gray-600/80 rounded-md "
            disabled={isPending}
          >
            {isPending ? 'Saving' : 'Save'}
          </button>
        </div>
        <div className="absolute left-1/2 h-full -z-10 rounded-3xl border-l-2 border-dashed " />
        <div className="space-y-5 mt-4 overflow-auto">
          {data &&
            data.modules &&
            data.modules.map((module: Module, index: number) => (
              <Modules
                key={module.id}
                index={index}
                id={module.id}
                title={module.title}
                lessons={module.lessons}
              />
            ))}
        </div>

        <div className="mt-6 mb-16">
          <NewModule />
        </div>

        {/* <div className="flex justify-end mt-4  gap-4">
          <Link
            href={`/add-course/${courseId}/`}
            className="py-1 px-2 rounded-md border text-gray-500 bg-gray-300/20 border-gray-400"
          >
            Back
          </Link>

        </div> */}
      </div>
    </>
  );
};

export default AddContent;
