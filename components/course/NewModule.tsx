'use client';

import { BiPlus } from 'react-icons/bi';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createModule } from '@/services/apis/module';
import { useParams } from 'next/navigation';
import queryClient from '@/utils/query-client';
import { RiLoader4Fill } from 'react-icons/ri';
import { Course } from '@/types/types';

const NewModule = ({}) => {
  const [inputText, setInputText] = useState<string>('');

  const { id: courseId } = useParams<{ id: string }>();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createModule,
    onSuccess: data => {
      try {
        queryClient.setQueryData(['courses', courseId], (oldData: Course) => {
          if (!oldData) return oldData;

          const newModule = {
            id: data.id,
            title: data.title,
            order: data.order,
            lessons: [],
          };

          return {
            ...oldData,
            modules: [...(oldData.modules ?? []), newModule],
          };
        });
      } catch {
        console.log('failed to Add Module');
      }
    },
  });
  const handleModuleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputText.trim() == '') {
      return;
    }

    await mutateAsync({ title: inputText, courseId });

    setInputText('');
  };

  return (
    <div className="mt-4 flex  justify-center items-center">
      <form
        className="flex-1 max-w-[700px] border border-gray-400/30 p-2 rounded-lg bg-white "
        onSubmit={handleModuleSubmit}
      >
        <div className="flex-1 flex  gap-4">
          <input
            placeholder="Enter New Module Name"
            className="flex-1  text-sm rounded-md  focus:outline-none py-1 px-2"
            value={inputText}
            onChange={event => setInputText(event.target.value)}
            type="text"
          />

          <button
            disabled={isPending}
            className={`bg-red-400/20 text-red-400 p-2 ${isPending ? 'animate-spin rounded-full' : 'rounded-md '}`}
          >
            {!isPending ? <BiPlus /> : <RiLoader4Fill />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewModule;
