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

  return await response.json();
};

export const editModule = async ({ title, moduleId }: { title: string; moduleId: string }) => {
  const response = await fetch(`/api/module/${moduleId}`, {
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

  return await response.json();
};
