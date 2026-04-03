import Navbar from '@/components/Navbar';
import HeroSection from '../components/landingPage/HeroSection';
import TechTeams from '@/components/landingPage/TechTeams';
export default function Home() {
  return (
    <>
      <Navbar />
      <div className='mx-20'>
        <HeroSection />
        <TechTeams />
      </div>
    </>
  );
}
