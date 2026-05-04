import { CourseCardProps, courseFormData, CourseType } from '@/types/types';

export type Lesson = {
  id: string;
  moduleId: string;
  title: string;
  duration: string;
  videoUrl?: string;
  videoLink?: string;
  isCompleted: boolean;
};

export type Module = {
  id: string;
  courseId: string;
  title: string;
};

export async function fetchCourses(
  { limit } = {} as { limit?: number }
): Promise<CourseCardProps[]> {
  const limitParam = limit !== undefined ? `?limit=${limit}` : '';
  const res = await fetch(`/api/course${limitParam}`);
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message ?? 'Failed to fetch courses');
  }

  return json.data as CourseCardProps[];
}

export async function getPendingCourses(): Promise<CourseType[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/course/pending`);

  if (!res.ok) {
    const text = await res.text();
    console.error('API ERROR:', text);
    throw new Error('Something went wrong');
  }

  const result = await res.json();

  return result.data;
}

export async function getAssignableCourses({
  limit,
  page,
  userId,
  role,
}: {
  limit: number;
  page: number;
  userId: string;
  role: 'TRAINEE' | 'MENTOR';
}) {
  const res = await fetch(
    `/api/course/not-assigned?limit=${limit}&page=${page}&userId=${userId}&role=${role}`
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error('Something went wrong');
  }

  const result = await res.json();
  return result.data;
}

export async function getAssignedCourses({
  limit,
  page,
  userId,
  role,
}: {
  limit: number;
  page: number;
  userId: string;
  role: 'TRAINEE' | 'MENTOR';
}) {
  const res = await fetch(
    `/api/course/assigned-courses?limit=${limit}&page=${page}&userId=${userId}&role=${role}`
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error('Something went wrong');
  }

  const result = await res.json();
  return result.data;
}

export const createCourse = async (course: courseFormData) => {
  const formData = new FormData();
  formData.append('title', course.title);
  formData.append('description', course.description);
  if (course.thumbnail) {
    formData.append('thumbnail', course.thumbnail);
  }

  const response = await fetch('/api/course', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    console.log(response);

    throw new Error('Failed to create courses');
  }

  const result = await response.json();
  return result.data;
};

export const getCourseById = async (courseId: string) => {
  const response = await fetch(`/api/course/${courseId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch course details');
  }

  const result = await response.json();

  return result.data;
};

export const updateCourse = async (courseId: string, course: courseFormData) => {
  const formData = new FormData();
  formData.append('title', course.title);
  formData.append('description', course.description);

  if (course.thumbnail) {
    formData.append('thumbnail', course.thumbnail);
  }

  const response = await fetch(`/api/course/${courseId}`, {
    method: 'PATCH',
    body: formData,
  });

  if (!response.ok) {
    console.log(response);
    throw new Error('Failed to update course');
  }

  const result = await response.json();
  return result.data;
};

export const saveCourse = async ({ courseId }: { courseId: string }) => {
  const response = await fetch(`/api/course/${courseId}/submit`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    console.log(response);
    throw new Error('course Saved Failes');
  }

  const result = await response.json();
  return result.data;
};

export const getTraineeCourses = async () => {
  const res = await fetch('/api/trainee/courses');

  if (!res.ok) {
    throw new Error('Failed to fetch trainee courses');
  }

  return res.json();
};

export const assignCourse = async ({
  courseIds,
  userId,
  role,
}: {
  courseIds: string[];
  userId: string;
  role: 'TRAINEE' | 'MENTOR';
}) => {
  try {
    const res = await fetch('/api/course/assign-course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseIds,
        userId,
        role,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message ?? 'Failed to assign courses');
    }

    return result.data;
  } catch (error) {
    console.error('ASSIGN COURSE ERROR:', error);
    throw error;
  }
};

export const restrictCourse = async ({
  courseIds,
  userId,
  role,
}: {
  courseIds: string[];
  userId: string;
  role: 'TRAINEE' | 'MENTOR';
}) => {
  try {
    const res = await fetch('/api/course/restrict-course', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseIds,
        userId,
        role,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message ?? 'Failed to restrict courses');
    }

    return result.data;
  } catch (error) {
    console.error('RESTRICT COURSE ERROR:', error);
    throw error;
  }
};

export const approveCourse = async (courseId: string) => {
  const res = await fetch(`/api/course/${courseId}/approve`, {
    method: 'PATCH',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to approve course');
  }

  return data;
};

export const getCourseDetails = async (courseId: string) => {
  const response = await fetch(`/api/course/${courseId}/details`, {
    method: 'GET',
  });

  if (!response.ok) {
    console.log(response);
  }

  const result = await response.json();

  return result.data;
};
