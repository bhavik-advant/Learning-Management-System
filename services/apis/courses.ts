import img from '@/assets/image.png';
import { courseFormData } from '@/types/types';
type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
};

export const DUMMY_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Introduction to React',
    description:
      'Learn the fundamentals of React, including components, props, state, and hooks to build dynamic user interfaces.',
    thumbnail: img.src,
    author: 'John Doe',
  },
  {
    id: 'c2',
    title: 'Mastering Next.js',
    description:
      'Dive deep into Next.js features such as routing, server components, API routes, and performance optimization.',
    thumbnail: img.src,
    author: 'Jane Smith',
  },
  {
    id: 'c3',
    title: 'TypeScript for Beginners',
    description:
      'Understand TypeScript basics, including types, interfaces, generics, and how to integrate it with modern JavaScript projects.',
    thumbnail: img.src,
    author: 'Alex Johnson',
  },
  {
    id: 'c4',
    title: 'Full-Stack Development with MERN',
    description:
      'Build scalable full-stack applications using MongoDB, Express, React, and Node.js.',
    thumbnail: img.src,
    author: 'Emily Davis',
  },
  {
    id: 'c5',
    title: 'Prisma & Database Management',
    description:
      'Learn how to design databases and interact with them efficiently using Prisma ORM.',
    thumbnail: img.src,
    author: 'Michael Brown',
  },
  {
    id: 'c6',
    title: 'Authentication with Clerk',
    description:
      'Implement secure authentication and user management in your applications using Clerk.',
    thumbnail: img.src,
    author: 'Sarah Wilson',
  },
  {
    id: 'c7',
    title: 'Tailwind CSS from Scratch',
    description:
      'Create beautiful and responsive user interfaces using the utility-first Tailwind CSS framework.',
    thumbnail: img.src,
    author: 'David Lee',
  },
  {
    id: 'c8',
    title: 'Building RESTful APIs with Node.js',
    description: 'Learn how to design and develop robust RESTful APIs using Node.js and Express.',
    thumbnail: img.src,
    author: 'Olivia Martinez',
  },
];
export const getAllCourses = () => {
  return DUMMY_COURSES;
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
