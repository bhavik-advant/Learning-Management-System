export const uploadFile = async ({
  courseId,
  moduleId,
  resource,
}: {
  courseId: string;
  moduleId: string;
  resource: File;
}) => {
  const formData = new FormData();

  formData.append('resource', resource);

  const response = await fetch(`/api/course/${courseId}/module/${moduleId}/lesson/file`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    console.log(response);

    throw new Error('Failed to upload resource');
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message);
  }

  return result.data;
};

export const deleteFile = async ({
  courseId,
  moduleId,
  fileId,
}: {
  courseId: string;
  moduleId: string;
  fileId: string;
}) => {
  const response = await fetch(`/api/course/${courseId}/module/${moduleId}/lesson/file/${fileId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    console.log(response);

    throw new Error('Failed to upload resource');
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message);
  }

  return result.data;
};
