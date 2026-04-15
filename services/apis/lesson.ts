export const addLesson = async ({
  moduleId,
  title,
  lesson,
  url,
}: {
  moduleId: string;
  title: string;
  lesson?: File | null;
  url?: string;
}) => {
  const maxSizeBytes = 100 * 1024 * 1024;
  const formData = new FormData();
  formData.append('title', title);
  if (url) {
    formData.append('url', url);
  }
  if (lesson) {
    if (lesson.size > maxSizeBytes) {
      const sizeInMB = (lesson.size / (1024 * 1024)).toFixed(2);
      throw new Error(`File size (${sizeInMB} MB) exceeds the maximum allowed limit of 100 MB.`);
    }
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

export const deletedLesson = async ({
  moduleId,
  lessonId,
}: {
  moduleId: string;
  lessonId: string;
}) => {
  const response = await fetch(`/api/module/${moduleId}/lesson/${lessonId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    console.log(response);

    throw new Error('Failed to create coursess');
  }

  return await response.json();
};
