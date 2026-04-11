export type courseFormData = {
  title: string;
  description: string;
  thumbnail: File | null;
};

export type UserRole = 'admin' | 'mentor' | 'trainee';
