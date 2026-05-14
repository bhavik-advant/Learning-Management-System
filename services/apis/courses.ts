import { courseFormData, CourseType } from '@/types/course';
import { sendRequest } from '@/utils/sendRequest';

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
  { limit, page, filters } = {} as {
    limit?: number;
    page?: number;
    filters?: {
      search: string;
      statusFilter: string;
    };
  }
) {
  const params = new URLSearchParams();

  if (limit !== undefined) {
    params.set('limit', String(limit));
  }

  if (page !== undefined) {
    params.set('page', String(page));
  }

  if (filters) {
    const { search, statusFilter } = filters;

    if (search) {
      params.set('search', search);
    }

    if (statusFilter && statusFilter !== 'ALL') {
      params.set('status', statusFilter);
    }
  }

  const query = params.toString();

  const url = query ? `/api/course?${query}` : '/api/course';

  const res = await sendRequest(url);

  return res.data;
}

export async function getPendingCourses(): Promise<CourseType[]> {
  const response = await sendRequest(`/api/course/pending`);
  return response.data;
}

export async function getAssignableCourses({
  limit,
  page,
  userId,
}: {
  limit: number;
  page: number;
  userId: string;
}) {
  const response = await sendRequest(
    `/api/course/not-assigned?limit=${limit}&page=${page}&userId=${userId}`
  );

  return response.data;
}

export async function getAssignedCourses({
  limit,
  page,
  userId,
  search,
}: {
  limit?: number;
  page: number;
  userId: string;
  search?: string;
}) {
  let url = `/api/course/assigned-courses?userId=${userId}&page=${page}`;

  if (limit !== undefined) {
    url += `&limit=${limit}`;
  }

  if (search) {
    url += `&search=${search}`;
  }

  const response = await sendRequest(url);

  return response.data;
}

export const createCourse = async (course: courseFormData) => {
  const formData = new FormData();
  formData.append('title', course.title);
  formData.append('description', course.description);
  if (course.thumbnail) {
    formData.append('thumbnail', course.thumbnail);
  }

  const response = await sendRequest('/api/course', 'post', formData);
  return response.data;
};

export const getCourseById = async (courseId: string) => {
  const response = await sendRequest(`/api/course/${courseId}`);

  return response.data;
};

export const updateCourse = async (courseId: string, course: courseFormData) => {
  const formData = new FormData();
  formData.append('title', course.title);
  formData.append('description', course.description);

  if (course.thumbnail) {
    formData.append('thumbnail', course.thumbnail);
  }

  const response = await sendRequest(`/api/course/${courseId}`, 'patch', formData);

  return response.data;
};

export const saveCourse = async ({ courseId }: { courseId: string }) => {
  const response = await sendRequest(`/api/course/${courseId}/submit`, 'patch');
  return response.data;
};

export const assignCourse = async ({
  courseIds,
  userId,
}: {
  courseIds: string[];
  userId: string;
}) => {
  const response = await sendRequest('/api/course/assign-course', 'post', {
    courseIds,
    userId,
  });

  return response.data;
};

export const restrictCourse = async ({
  courseIds,
  userId,
}: {
  courseIds: string[];
  userId: string;
}) => {
  const response = await sendRequest('/api/course/restrict-course', 'delete', {
    courseIds,
    userId,
  });
  return response.data;
};

export const approveCourse = async (courseId: string) => {
  const response = await sendRequest(`/api/course/${courseId}/approve`, 'patch');

  return response.data;
};

export const getCourseDetails = async (courseId: string) => {
  const response = await sendRequest(`/api/course/${courseId}/details`, 'get');

  return response.data;
};

export const inactiveCourse = async (courseId: string) => {
  const response = await sendRequest(`/api/course/inactive/${courseId}`, 'patch');

  return response.data;
};

export const getMyCourses = async () => {
  const response = await sendRequest(`/api/course/my-courses`, 'get');

  return response.data;
};

export const reactivateCourse = async (courseId: string) => {
  const response = await sendRequest(`/api/course/reactivate/${courseId}`, 'patch');
  return response.data;
};
