import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getUserByClerkId } from './services/repository/user';
import { userRoleCheck } from './utils/checkUserRole';

// const isProtectedRoute = createRouteMatcher(['/app(.*)']);
const publicRoutes = createRouteMatcher([
  '/',
  '/auth/signin(.*)',
  '/auth/signup(.*)',
  '/api/webhooks(.*)',
]);

const traineeAccessRoutes = createRouteMatcher([
  '/app',
  '/app/courses(.*)',
  '/app/assignments(.*)',
  '/app/submissions(.*)',
  '/app/notification(.*)',
  '/api/course',
  '/api/assignments',
  '/api/submission',
  '/api/submission/([^/]+)',
  '/api/assignments/([^/]+)',
  '/api/assignments/submit',
  '/api/course/([^/]+)',
  '/api/notification(.*)'
]);

const mentorAccessRoutes = createRouteMatcher([
  '/app',
  '/app/assign-course(.*)',
  '/app/courses(.*)',
  '/app/my-courses(.*)',
  '/app/assigned-courses(.*)',
  '/app/add-course(.*)',
  '/app/review-submission(.*)',
  '/app/submissions(.*)',
  '/app/assignments(.*)',
  '/app/notification(.*)',
  '/api/(.*)',
]);

const AdminAccessRoutes = createRouteMatcher([
  '/app/(.*)',
  '/app',
  '/app/assign-course(.*)',
  '/app/courses(.*)',
  '/app/assigned-courses(.*)',
  '/app/add-course(.*)',
  '/app/users(.*)',
  '/app/approvals(.*)',
  '/app/submissions(.*)',
  '/app/assignments(.*)',
  '/app/notification(.*)',
  '/api/(.*)',
]);

const mentorProhibitedRoutes = createRouteMatcher(['/api/course/([^/]+)/approve']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (publicRoutes(req)) {
    return NextResponse.next();
  }

  if (!userId && req.nextUrl.pathname.includes('/app')) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  if (!userId) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  let user;
  try {
    user = await getUserByClerkId(userId);
  } catch {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  if (!user) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  if (userRoleCheck.isTrainee(user.role) && traineeAccessRoutes(req)) {
    return NextResponse.next();
  }

  if (
    userRoleCheck.isMentor(user.role) &&
    mentorAccessRoutes(req) &&
    !mentorProhibitedRoutes(req)
  ) {
    return NextResponse.next();
  }
  if (userRoleCheck.isAdmin(user.role) && AdminAccessRoutes(req)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/app', req.url));
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    // '/(api|trpc)(.*)',
  ],
};
