export type courseFormData = {
  title: string;
  description: string;
  thumbnail: File | null;
};

export type UserRole = 'admin' | 'mentor' | 'trainee';

export type PrismaUserRole = 'ADMIN' | 'MENTOR' | 'TRAINEE';

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
  content: string;
};

export type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
  assignments: Assignment[];
};

export type Assignment = {
  id: string;
  title: string;
  description: string;
  maxScore: number;
};

export type Course = {
  id: string;
  title: string;
  status: string;
  description: string;
  thumbnail: string | null;
  modules: Module[];
};

export type CourseCardProps = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  author: string;
  image: string;
  status: string;
  authorId: string;
  thumbnailId: string | null;
  createdAt: string;
  updatedAt: string;
  modulesCount: number;
};

export type AssignmentFormProps = {
  submitText: string;
  title?: string;
  description?: string;
  maxScore?: number;
  moduleId: string;
  isPending: boolean;
  onClose: () => void;
  func: ({
    title,
    description,
    maxScore,
  }: {
    title: string;
    description: string;
    maxScore: number;
  }) => Promise<void>;
} & Record<string, unknown>;

export type AssignmentFilter = {
  search: string;
  statusFilter: 'ALL' | 'NOT_SUBMITTED' | 'PENDING' | 'GRADED' | 'RESUBMITTED';
};

export type CourseStatus = 'DRAFT' | 'PENDING' | 'APPROVED';

export type CoursesLayoutProps = {
  title: string;
  subtitle?: string;
  count?: number;
  isError?: boolean;
  errorText?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  role?: PrismaUserRole;
};

export type PaginationDataType = {
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type SubmissionStatus = 'PENDING' | 'GRADED' | 'RESUBMITTED';

export type NotificationItem = {
  link: string | null;
  id: string;
  userId: string;
  createdAt: Date;
  message: string;
  isRead: boolean;
};

export type NotificationMeta = {
  unreadCount: number;
  readCount: number;
  totalCount: number;
};

export type NotificationsData = {
  notifications: NotificationItem[];
  meta: NotificationMeta;
};
