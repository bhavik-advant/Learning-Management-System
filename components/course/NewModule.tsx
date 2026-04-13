'use client';

import { BiPlus } from 'react-icons/bi';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createModule } from '@/services/apis/module';
import { useParams } from 'next/navigation';

type ModuleFormCreateProps = {
  onAddModule: (id: string, title: string) => void;
};

type ModuleFormProps = ModuleFormCreateProps;
const NewModule: React.FC<ModuleFormProps> = ({ onAddModule }) => {
  const [inputText, setInputText] = useState<string>('');

  const { id: courseId } = useParams<{ id: string }>();

  const { mutateAsync, isPending } = useMutation({ mutationFn: createModule });
  const handleModuleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await mutateAsync({ title: inputText, courseId });
    console.log(response);
    
    if (response.success && response.statusCode == 201) {
      onAddModule(response.data.id, response.data.title);
    }

    setInputText('');
  };

  return (
    <div className="mt-4 space-y-4 border-2 border-dashed border-gray-300 rounded-2xl p-4">
      <form className="flex flex-col space-y-2" onSubmit={handleModuleSubmit}>
        <h2 className="text-lg text-gray-600">Add Module</h2>
        <div className="flex gap-4">
          <input
            placeholder="Module Name "
            className="flex-1 border rounded-md border-blue-500 focus:outline-none py-1 px-2"
            value={inputText}
            onChange={event => setInputText(event.target.value)}
            type="text"
          />

          <button
            disabled={isPending}
            className={`bg-red-400/20 text-red-400 p-2 rounded-md ${isPending && 'animate-bounce'}`}
          >
            <BiPlus />
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewModule;
