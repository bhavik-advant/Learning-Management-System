// import getUserDetails from '@/lib/isAuth';
// import ApiResponse from '@/utils/api-response';
// import { prisma } from '@/utils/prisma-client';
// import { NextResponse } from 'next/server';

// export const GET = async () => {
//   try {
//     let user;
//     try {
//       user = await getUserDetails();
//     } catch (error) {
//       const message = error instanceof Error ? error.message : 'Please login first';

//       return NextResponse.json(new ApiResponse(401, message, {}), { status: 401 });
//     }

//     if(user.role == 'TRAINEE'){
//       return NextResponse.json(new ApiResponse(401, 'Unauthorised', {}), { status: 401 });
//     }

//     const allTrainees = await prisma.user.findMany({ where: { role: 'TRAINEE' } });

//     return NextResponse.json(
//       new ApiResponse(200, 'All Trainne are fetched successfully', allTrainees),
//       {
//         status: 200,
//       }
//     );
//   } catch (error) {
//     return NextResponse.json(new ApiResponse(401, 'Internal Server Error', {}), { status: 401 });
//   }
// };
