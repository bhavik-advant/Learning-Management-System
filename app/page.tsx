
import TechTeams from '@/components/landingPage/TechTeams';
import Navbar from "@/components/Navbar";
import HeroSection from "../components/landingPage/HeroSection";
import { Workflow } from "@/components/landingPage/WorkFlow";

export default function Home() {
  return (
   <>
    <Navbar />
    <HeroSection />
    <Workflow />
    <TechTeams/>
   </>
  );
}
