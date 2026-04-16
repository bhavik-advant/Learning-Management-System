export const createModule = async ({ title, courseId }: { title: string; courseId: string }) => {
  const response = await fetch(`/api/course/${courseId}/module`, {
    method: 'POST',
    body: JSON.stringify({ title }),
    headers: {
      'Content-Type': 'application/json',
    },
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

export const editModule = async ({
  courseId,
  title,
  moduleId,
}: {
  courseId: string;
  title: string;
  moduleId: string;
}) => {
  const response = await fetch(`/api/course/${courseId}/module/${moduleId}`, {
    method: 'POST',
    body: JSON.stringify({ title }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.log(response);

    throw new Error('Failed to create coursess');
  }

  const result = await response.json();

  if (!result.success && result.statusCode != 200) {
    throw new Error(result.message);
  }

  return result.data;
};
