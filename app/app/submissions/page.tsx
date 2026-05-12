import SubmissionsPage from '@/components/submissions/SubmissionsPage';

export const metadata = {
  title: 'Submissions',
  description:
    'View and manage all your submissions in one place. Track the status of your assignments, review feedback, and stay organized with your personalized submissions dashboard.',
};

export default async function MySubmissions() {
  return <SubmissionsPage />;
}
