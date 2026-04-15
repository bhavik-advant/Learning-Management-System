export type courseFormData = {
  title: string;
  description: string;
  thumbnail: File | null;
};

export type UserRole = 'admin' | 'mentor' | 'trainee';

export type CourseType = {
  id: string;
  title: string;
  description: string;
  mentor: string;
  submittedAt: string;
  modules: number;
  lessons: number;
  image: string | null;
};

export type Lesson = {
  id: string;
  title: string;
  url: string | null;
};

export type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  modules: Module[];
};
