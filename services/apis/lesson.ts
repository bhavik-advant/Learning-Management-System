export const addLesson = async ({
  moduleId,
  lesson,
}: {
  moduleId: string;
  lesson: File | null;
}) => {
  const formData = new FormData();
  formData.append('moduleId', moduleId);
  if (lesson) {
    formData.append('lesson', lesson);
  }

  const response = await fetch(`/api/module/${moduleId}/lesson`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    console.log(response);

    throw new Error('Failed to create coursess');
  }

  return await response.json();
};
