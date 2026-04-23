import { courseFormData, CourseType } from '@/types/types';
export type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
  status: string;
  authorId: string;
  thumbnailId: string | null;
  createdAt: string;
  updatedAt: string;
  modulesCount: number;
};

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

export async function fetchCourses(): Promise<Course[]> {
  const res = await fetch('/api/course');
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message ?? 'Failed to fetch courses');
  }

  return json.data as Course[];
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
  traineeId,
}: {
  limit: number;
  page: number;
  traineeId: string;
}) {
  const res = await fetch(
    `/api/course/not-assigned?limit=${limit}&page=${page}&traineeId=${traineeId}`
  );

  console.log(res);

  if (!res.ok) {
    const text = await res.text();
    console.log('API ERROR:', text);
    throw new Error('Something went wrong');
  }

  const result = await res.json();

  return result.data;
}

export async function getAssignedCourses({
  limit,
  page,
  traineeId,
}: {
  limit: number;
  page: number;
  traineeId: string;
}) {
  const res = await fetch(
    `/api/course/assigned?limit=${limit}&page=${page}&traineeId=${traineeId}`
  );

  if (!res.ok) {
    const text = await res.text();
    console.log('API ERROR:', text);
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

  return await response.json();
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

  return await response.json();
};

export const getApprovedCourses = async (courseId: string) => {
  try {
    const res = await fetch(`/api/course/${courseId}/not-assigned`, {
      method: 'PATCH',
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error(' ', error);
    throw error;
  }
};

export const saveCourse = async (courseId: string) => {
  const response = await fetch(`/api/course/${courseId}/submit`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    console.log(response);
    throw new Error('course Saved Failes');
  }

  return await response.json();
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
  traineeId,
}: {
  courseIds: string[];
  traineeId: string;
}) => {
  try {
    const res = await fetch('/api/course/assign-course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseIds,
        traineeId,
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
  traineeId,
}: {
  courseIds: string[];
  traineeId: string;
}) => {
  try {
    const res = await fetch('/api/course/restrict-course', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseIds,
        traineeId,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message ?? 'Failed to restrict courses');
    }

    return result.data;
  } catch (error) {
    console.error('Restrict COURSE ERROR:', error);
    throw error;
  }
};

export const approveCourse = async (courseId: string) => {
  const res = await fetch(`/api/admin/courses/approve/${courseId}`, {
    method: 'PATCH',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to approve course');
  }

  return data;
};
