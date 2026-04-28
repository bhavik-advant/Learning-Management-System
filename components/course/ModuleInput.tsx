'use client';

import { deleteModule, editModule } from '@/services/apis/module';
import { Course } from '@/types/types';
import queryClient from '@/utils/query-client';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { BiSave, BiTrash } from 'react-icons/bi';
import { MdClose } from 'react-icons/md';
import { RiLoader4Fill } from 'react-icons/ri';
import { VscEdit } from 'react-icons/vsc';

const ModuleInput: React.FC<{ title?: string; moduleId: string; index: number }> = ({
  title,
  moduleId,
  index,
}) => {
  const { id: courseId } = useParams<{ id: string }>();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: editModule,
    onSuccess: (data, variable) => {
      try {
        queryClient.setQueryData(['courses', courseId], (old: Course) => {
          if (!old) return old;

          return {
            ...old,
            modules: old.modules.map(module =>
              module.id === variable.moduleId ? { ...module, title: variable.title } : module
            ),
          };
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

  const [text, setText] = useState<string>(title ?? '');
  const [showEditForm, setShowEditForm] = useState(false);

  const { mutateAsync: deleteModuleFunc, isPending: isDeleting } = useMutation({
    mutationFn: deleteModule,
    onSuccess: () => {
      queryClient.setQueryData(['courses', courseId], (old: Course) => {
        if (!old) {
          return old;
        }

        return {
          ...old,
          modules: old.modules.filter(module => module.id != moduleId),
        };
      });
    },
  });

  const handleEditTitle = async () => {
    if (text.trim() == '') {
      return;
    }

    await mutateAsync({ courseId, title: text, moduleId });
    setShowEditForm(false);
  };

  const handleDelete = async () => {
    await deleteModuleFunc({ courseId, moduleId });
  };

  return (
    <div className="flex justify-center bg-white dark:bg-[#1e2939] items-center gap-4">
      <h4 className="text-md font-medium">{index + 1}</h4>
      <div className="border flex-1 max-w-[800px] flex justify-between w-full border-gray-400/40 p-2 rounded-xl">
        <input
          className="flex-1 text-sm h-9 px-2 focus:outline-none transition disabled:cursor-not-allowed disabled:opacity-70"
          value={text}
          onChange={event => setText(event.target.value)}
          type="text"
          disabled={!showEditForm || isPending}
        />

        {showEditForm ? (
          <div className="flex gap-4">
            <button
              onClick={() => setShowEditForm(false)}
              disabled={isPending}
              className="bg-red-500/20 p-2 rounded-lg hover:bg-red-500/30 transition disabled:opacity-80 disabled:cursor-not-allowed"
            >
              <MdClose className="text-red-400" />
            </button>

            <button
              onClick={handleEditTitle}
              disabled={isPending}
              className="bg-blue-500/20 p-2 rounded-lg hover:bg-blue-500/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <RiLoader4Fill className=" border-blue-400 animate-spin" />
              ) : (
                <BiSave className="text-blue-500 " />
              )}
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => setShowEditForm(true)}
              disabled={isDeleting}
              className="bg-blue-500/20 p-2 rounded-lg hover:bg-blue-500/30 transition"
            >
              <VscEdit className="text-blue-500" />
            </button>
            <button
              disabled={isDeleting}
              onClick={handleDelete}
              className="bg-red-500/20 p-2 rounded-lg hover:bg-blue-500/30 transition"
            >
              {isDeleting ? (
                <RiLoader4Fill className=" border-red-400 animate-spin" />
              ) : (
                <BiTrash
                  className={`text-red-500 dark:text-red-300 ${isDeleting && 'animate-spin'}`}
                />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleInput;
