export const addLesson = async ({
  courseId,
  moduleId,
  title,
  content,
}: {
  courseId: string;
  moduleId: string;
  title: string;
  content: string;
}) => {
  const response = await fetch(`/api//course/${courseId}/module/${moduleId}/lesson`, {
    method: 'POST',
    body: JSON.stringify({
      title,
      content,
    }),
  });

  if (!response.ok) {
    console.log(response);

    throw new Error('Failed to create coursess');
  }

  const result = await response.json();

  if (!result.success && result.statusCode != 201) {
    throw new Error(result.message);
  }

  return result.data;
};

export const deleteLesson = async ({
  courseId,
  moduleId,
  lessonId,
}: {
  courseId: string;
  moduleId: string;
  lessonId: string;
}) => {
  const response = await fetch(`/api/course/${courseId}/module/${moduleId}/lesson/${lessonId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    console.log(response);

    throw new Error('Failed to create coursess');
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message);
  }

  return result.data;
};

export const editLesoon = async ({
  courseId,
  moduleId,
  lessonId,
  title,
  content,
}: {
  courseId: string;
  moduleId: string;
  lessonId: string;
  title: string;
  content: string;
}) => {
  const response = await fetch(`/api/course/${courseId}/module/${moduleId}/lesson/${lessonId}`, {
    method: 'PATCH',
    body: JSON.stringify({ title, content }),
  });

  if (!response.ok) {
    console.log(response);

    throw new Error('Failed to update Lesson');
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message);
  }

  return result.data;
};
