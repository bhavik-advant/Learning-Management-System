import { courseFormData, CourseType } from '@/types/types';
export type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
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

export const getCourseById = async (id: string) => {
  const response = await fetch(`/api/course/${id}`, {
    method: 'GET',
  });

  if (!response.ok) {
    console.log(response);
    throw new Error('Failed to fetch course details');
  }

  const result = await response.json();

  return result.data;
};

export const approveCourse = async (courseId: string) => {
  try {
    const res = await fetch(`/api/course/${courseId}/approve`, {
      method: 'PATCH',
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error('APPROVE COURSE ERROR:', error);
    throw error;
  }
};
