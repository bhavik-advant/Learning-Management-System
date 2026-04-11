import TechTeams from '@/components/landingPage/TechTeams';
import Roles from '@/components/landingPage/Roles';
import Footer from '@/components/landingPage/Footer';
import Workflow from '@/components/landingPage/WorkFlow';
import HeroSection from '@/components/landingPage/HeroSection';
import NavbarWrapper from '@/components/landingPage/NavbarWrapper';

export default function Home() {
  return (
    <>
      <NavbarWrapper />
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
