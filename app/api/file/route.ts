// api/file/route.ts
import { uploadToCloudinary } from '@/services/external/cloudinary';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();

  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ message: 'provide valid file', status: 400 });
  }

  const result = await uploadToCloudinary(file);

  console.log(result);

  return NextResponse.json({ message: 'uploaded Image', data: result });
};
