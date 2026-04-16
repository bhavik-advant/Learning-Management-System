'use client';

import { editModule } from '@/services/apis/module';
import queryClient from '@/utils/query-client';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { BiEdit, BiSave } from 'react-icons/bi';
import { MdClose } from 'react-icons/md';

const ModuleInput: React.FC<{ title?: string; moduleId: string }> = ({ title, moduleId }) => {
  const { id: courseId } = useParams<{ id: string }>();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: editModule,
    onSuccess: (data, variable) => {
      try {
        queryClient.setQueryData(['courses', courseId], (old: any) => {
          if (!old) return old;
          console.log(old, ' and ', data);

          return {
            ...old.data,
            modules: old.modules.map((module: any) =>
              module.id === variable.moduleId ? { ...module, title: variable.title } : module
            ),
          };
        });
      } catch (error) {}
    },
  });

  const [text, setText] = useState<string>(title ?? '');
  const [showEditForm, setShowEditForm] = useState(false);

  const handleEditTitle = async () => {
    if (text.trim() == '') {
      return;
    }

    await mutateAsync({ courseId, title: text, moduleId });
    setShowEditForm(false);
  };

  return (
    <div className="flex gap-4">
      <input
        className="flex-1 border border-gray-500/50 rounded-md py-1 px-2 focus:outline-none focus:ring-1 focus:ring-blue-400 transition disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
        value={text}
        onChange={event => setText(event.target.value)}
        type="text"
        disabled={!showEditForm || isPending}
      />

      {showEditForm ? (
        <>
          <button
            onClick={() => setShowEditForm(false)}
            disabled={isPending}
            className="bg-red-500/20 p-2 rounded-lg hover:bg-red-500/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <MdClose className="text-red-400" />
          </button>

          <button
            onClick={handleEditTitle}
            disabled={isPending}
            className="bg-blue-500/20 p-2 rounded-lg hover:bg-blue-500/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <BiSave className={`text-blue-500 ${isPending ? 'animate-spin' : ''}`} />
          </button>
        </>
      ) : (
        <button
          onClick={() => setShowEditForm(true)}
          className="bg-blue-500/20 p-2 rounded-lg hover:bg-blue-500/30 transition"
        >
          <BiEdit className="text-blue-500" />
        </button>
      )}
    </div>
  );
};

export default ModuleInput;
