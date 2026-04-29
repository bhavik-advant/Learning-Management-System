import { MarkdownEditor } from '@/components/mdxEditor';
import { Card } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import AssignmentForm from './AssignmentForm';
import { useModifyAssignment } from '@/hooks/courses/assignment/useModifyAssignment';
import DropDown from '@/components/ui/DropDown';
import { useDeleteAssignment } from '@/hooks/courses/assignment/useDeleteAssignment';
import { RiLoader4Fill } from 'react-icons/ri';

type Assignment = {
  id: string;
  title: string;
  description: string;
  maxScore: number;
};

const Assignment = ({ assignment, moduleId }: { assignment: Assignment; moduleId: string }) => {
  const { id: courseId } = useParams<{ id: string }>();
  const [showEditForm, setShowEditForm] = useState(false);

  const { updateAssignment, isUpdating } = useModifyAssignment(courseId, moduleId);
  const { deleteAssignment, isDeleting } = useDeleteAssignment(courseId, moduleId);

  const handleUpdateAssignment = async ({
    title,
    description,
    maxScore,
  }: {
    title: string;
    description: string;
    maxScore: number;
  }) => {
    await updateAssignment({
      assignmentId: assignment.id,
      courseId,
      moduleId,
      description,
      maxScore,
      title,
    });
  };

  if (showEditForm) {
    return (
      <AssignmentForm
        submitText="Save"
        moduleId={moduleId}
        isPending={isUpdating || isDeleting}
        func={handleUpdateAssignment}
        onClose={setShowEditForm.bind(null, false)}
        description={assignment.description}
        maxScore={assignment.maxScore}
        title={assignment.title}
      />
    );
  }
  const handleSelectDropDown = async (val: string) => {
    if (val == 'Edit') {
      setShowEditForm(true);
    } else if (val == 'Delete') {
      await deleteAssignment({ assignmentId: assignment.id, courseId, moduleId });
    }
  };
  return (
    <div
      key={assignment.id}
      className="flex justify-center bg-white dark:bg-[#1e2939] items-center"
    >
      <Card className="max-w-150 flex-1 border max-h-110 border-gray-400/30 p-4">
        <div className="flex justify-between items-center px-2">
          <div>
            <div className="font-medium">{assignment.title}</div>
            <div className="text-xs text-muted-foreground">Max score: {assignment.maxScore}</div>
          </div>
          <div>
            {isDeleting ? (
              <RiLoader4Fill className="animate-spin" />
            ) : (
              <DropDown
                trigger={<BsThreeDotsVertical />}
                options={['Edit', 'Delete']}
                onSelect={handleSelectDropDown}
              />
            )}
          </div>
        </div>

        <MarkdownEditor
          courseId={courseId}
          moduleId={moduleId}
          value={assignment.description ?? ''}
          onChange={() => {}}
          readOnly
          isEditing={false}
          className="overflow-auto no-scrollbar"
        />
      </Card>
    </div>
  );
};

export default Assignment;
