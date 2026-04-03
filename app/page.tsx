import Navbar from '@/components/Navbar';
import HeroSection from '../components/landingPage/HeroSection';
import TechTeams from '@/components/landingPage/TechTeams';
import Roles from '@/components/landingPage/Roles';
import { Workflow } from '@/components/landingPage/WorkFlow';
export default function Home() {
  return (
    <>
      <Navbar />
      <div className="mx-20">
        <HeroSection />
        <Workflow />
        <TechTeams />
        <Roles />
      </div>
    </>
  );
}
