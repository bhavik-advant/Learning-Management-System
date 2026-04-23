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
    onSuccess: () => {
      router.push(`/${role.toLowerCase()}/courses`);
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => getCourseById(courseId),
  });

  if (isLoading) {
    return <p>Loading....</p>;
  }

  const handleSaveCourse = async () => {
    await mutateAsync(courseId);
  };

  return (
    <>
      <div className="relative h-full w-full overflow-hidden ">
        <div className="flex justify-end gap-4 ">
          <Link
            href={`/add-course/${courseId}/`}
            className="py-1 px-2 text-md border border-gray-600/80 text-gray-600/80 rounded-md"
          >
            Back
          </Link>
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
      </div>
    </>
  );
};

export default AddContent;
