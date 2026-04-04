import Navbar from '@/components/Navbar';
import HeroSection from '../components/landingPage/HeroSection';
import TechTeams from '@/components/landingPage/TechTeams';
import Roles from '@/components/landingPage/Roles';
import Footer from '@/components/landingPage/Footer';
import { Workflow } from '@/components/landingPage/WorkFlow';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="mx-4 sm:mx-8 lg:mx-14 xl:mx-24 space-y-10 ">
        <HeroSection />
        <Workflow />
        <TechTeams />
        <Roles />
      </div>
      <Footer />
    </>
  );
}
