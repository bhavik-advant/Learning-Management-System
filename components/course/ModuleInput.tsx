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
    onSuccess: (response, variable) => {
      if (!response.success || response.statusCode !== 200 || !courseId) {
        return;
      }

      queryClient.setQueryData(['courses', courseId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            modules: old.data.modules.map((module: any) =>
              module.id === variable.moduleId ? { ...module, title: variable.title } : module
            ),
          },
        };
      });
    },
  });

  const [text, setText] = useState<string>(title ?? '');
  const [showEditForm, setShowEditForm] = useState(false);

  const handleEditTitle = async () => {
    if (text.trim() == '') {
      return;
    }

    await mutateAsync({ title: text, moduleId });
    setShowEditForm(false);
  };

  return (
    <div className="flex gap-4">
      <input
        className="flex-1 border rounded-md border-gray-500/50 focus:outline-none py-1 px-2"
        value={text}
        onChange={event => setText(event.target.value)}
        type="text"
        disabled={!showEditForm}
      />
      {showEditForm ? (
        <>
          <button
            onClick={() => setShowEditForm(false)}
            disabled={isPending}
            className="bg-red-500/20 p-2 rounded-lg"
          >
            <MdClose className="text-red-400" />
          </button>
          <button
            onClick={handleEditTitle}
            className="bg-blue-500/20 p-2 rounded-lg"
            disabled={isPending}
          >
            <BiSave className="text-blue-500" />
          </button>
        </>
      ) : (
        <button onClick={() => setShowEditForm(true)} className="bg-blue-500/20 p-2 rounded-lg">
          <BiEdit className="text-blue-500" />
        </button>
      )}
    </div>
  );
};

export default ModuleInput;
