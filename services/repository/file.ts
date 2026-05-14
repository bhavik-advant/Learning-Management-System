import { FileType } from '@/types/file';
import ApiError from '@/utils/api-error';
import { prisma } from '@/utils/prisma-client';

export const deleteFiles = async (fileIds: string[]) => {
  const filesToDelete = await prisma.file.findMany({
    where: {
      id: {
        in: fileIds,
      },
    },
    select: {
      id: true,
      public_id: true,
      type: true,
    },
  });
  await prisma.file.deleteMany({
    where: {
      id: {
        in: filesToDelete.map(file => file.id),
      },
    },
  });

  return filesToDelete;
};

export const deleteFile = async (fileId: string) => {
  const file = await prisma.file.findUnique({
    where: { id: fileId },
    select: {
      id: true,
      public_id: true,
      type: true,
    },
  });

  if (!file) {
    throw new ApiError(404, 'File not found');
  }
  await prisma.file.delete({
    where: { id: file.id },
  });

  return file;
};

export const createFile = async ({
  url,
  public_id,
  type,
  size,
  userId,
}: {
  url: string;
  public_id: string;
  type: FileType;
  size: number;
  userId: string;
}) => {
  const file = await prisma.file.create({
    data: {
      url,
      public_id,
      type,
      size,
      uploadedBy: userId,
    },
  });
  return file;
};

export const getFileById = async (fileId: string) => {
  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });

  return file;
};
