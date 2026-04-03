import Image from 'next/image';
import Button from '../ui/button';

export default function HeroSection() {
  return (
    <>
      <div className="grid sm:grid-cols-2 min-h-screen max-w-screen w-full items-center z-10 ">
        <div className="text-left space-y-5">
          <h1 className="text-6xl font-bold">Master Your Craft.</h1>
          <h2 className="text-6xl font-bold bg-linear-to-r from-[#828bf8] to-[#5d447f] bg-clip-text text-transparent">
            Accelerate Growth.
          </h2>
          <p className="text-lg text-gray-500 flex items-center justify-start ">
            The ultimate learning management system designed specifically<br></br> for tech teams.
            Streamline onboarding, track technical assignments, and<br></br> empower mentorship in
            one unified platform.
          </p>
          <Button>Get Started</Button>
        </div>
        <div className="flex items-end justify-center">
          <Image
            src="/images/landingPage/man-studying.png"
            alt="Hero Image"
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </>
  );
}
