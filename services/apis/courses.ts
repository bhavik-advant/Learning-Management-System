import img from '@/assets/image.png';
import { getAssignmentsByCourse } from './Assignments';
// TYPES
import { courseFormData } from '@/types/types';
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

// COURSES (5+)
export const DUMMY_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Introduction to React',
    description: 'Learn React fundamentals.',
    thumbnail: img.src,
    author: 'John Doe',
  },
  {
    id: 'c2',
    title: 'Mastering Next.js',
    description: 'Deep dive into Next.js.',
    thumbnail: img.src,
    author: 'Jane Smith',
  },
  {
    id: 'c3',
    title: 'TypeScript Basics',
    description: 'Learn TypeScript from scratch.',
    thumbnail: img.src,
    author: 'Alex Johnson',
  },
  {
    id: 'c4',
    title: 'Node.js Backend',
    description: 'Build APIs with Node.js.',
    thumbnail: img.src,
    author: 'Emily Davis',
  },
  {
    id: 'c5',
    title: 'UI/UX Design',
    description: 'Design beautiful interfaces.',
    thumbnail: img.src,
    author: 'Michael Brown',
  },
];

// MODULES
export const DUMMY_MODULES: Module[] = [
  // React
  { id: 'm1', courseId: 'c1', title: 'React Basics' },
  { id: 'm2', courseId: 'c1', title: 'Advanced React' },

  // Next.js
  { id: 'm3', courseId: 'c2', title: 'Next.js Core' },
  { id: 'm4', courseId: 'c2', title: 'Routing & APIs' },

  // TS
  { id: 'm5', courseId: 'c3', title: 'TS Fundamentals' },

  // Node
  { id: 'm6', courseId: 'c4', title: 'Node Basics' },

  // UI
  { id: 'm7', courseId: 'c5', title: 'Design Principles' },
];

// LESSONS
export const DUMMY_LESSONS: Lesson[] = [
  // React Lessons
  {
    id: 'l1',
    moduleId: 'm1',
    title: 'Intro to React',
    duration: '10:00',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    isCompleted: true,
  },
  {
    id: 'l2',
    moduleId: 'm1',
    title: 'JSX Explained',
    duration: '15:00',
    videoLink: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
    isCompleted: false,
  },
  {
    id: 'l3',
    moduleId: 'm2',
    title: 'React Hooks',
    duration: '20:00',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    isCompleted: false,
  },

  // Next.js
  {
    id: 'l4',
    moduleId: 'm3',
    title: 'Next.js Intro',
    duration: '12:00',
    videoLink: 'https://www.youtube.com/watch?v=1WmNXEVia8I',
    isCompleted: true,
  },
  {
    id: 'l5',
    moduleId: 'm4',
    title: 'API Routes',
    duration: '18:00',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    isCompleted: false,
  },

  // TS
  {
    id: 'l6',
    moduleId: 'm5',
    title: 'Types in TS',
    duration: '14:00',
    videoLink: 'https://www.youtube.com/watch?v=30LWjhZzg50',
    isCompleted: false,
  },

  // Node
  {
    id: 'l7',
    moduleId: 'm6',
    title: 'Node Intro',
    duration: '11:00',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    isCompleted: true,
  },

  // UI
  {
    id: 'l8',
    moduleId: 'm7',
    title: 'Design Basics',
    duration: '16:00',
    videoLink: 'https://www.youtube.com/watch?v=3YjWnq7F3qI',
    isCompleted: false,
  },
];

// FUNCTIONS
export const getAllCourses = () => DUMMY_COURSES;

export const getCoursesById = (id: string) => DUMMY_COURSES.find(c => c.id === id);

export const getCourseFullDetails = (courseId: string) => {
  const modules = DUMMY_MODULES.filter(m => m.courseId === courseId);

  const structuredModules = modules.map(module => ({
    ...module,
    lessons: DUMMY_LESSONS.filter(l => l.moduleId === module.id),
  }));

  const assignments = getAssignmentsByCourse(courseId);

  return {
    modules: structuredModules,
    assignments,
  };
};

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

    throw new Error('Failed to create coursess');
  }

  return await response.json();
};
