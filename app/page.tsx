import TechTeams from '@/components/landingPage/TechTeams';
import Roles from '@/components/landingPage/Roles';
import Footer from '@/components/landingPage/Footer';
import Workflow from '@/components/landingPage/WorkFlow';
import HeroSection from '@/components/landingPage/HeroSection';
import Navbar from '@/components/landingPage/Navbar';
import { GradientBackground } from '@/components/landingPage/bg';

export default function Home() {
  return (
    <>
      <Navbar />
      <GradientBackground>
        <HeroSection />
      </GradientBackground>
      <div className="mx-4 sm:mx-8 lg:mx-14 xl:mx-24 space-y-10 mt-5">
        <Workflow />
        <TechTeams />
        <Roles />
      </div>
      <Footer />
    </>
  );
}
