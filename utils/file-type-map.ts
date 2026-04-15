import { FileType } from '@/generated/prisma/enums';

export const FileTypeToResourceType: Record<FileType, 'image' | 'video' | 'raw'> = {
  [FileType.IMAGE]: 'image',
  [FileType.VIDEO]: 'video',
  [FileType.DOCUMENT]: 'raw',
  [FileType.OTHER]: 'raw',
};

export const ResourceTypeToPrisma: Record<'image' | 'video' | 'raw', FileType> = {
  image: FileType.IMAGE,
  video: FileType.VIDEO,
  raw: FileType.DOCUMENT,
};
