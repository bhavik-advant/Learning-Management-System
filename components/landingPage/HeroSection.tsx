import Image from 'next/image';
import Button from '../button';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden min-h-screen flex items-center">
      {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#c7d2fe,transparent_40%),radial-gradient(circle_at_80%_20%,#fbcfe8,transparent_40%),radial-gradient(circle_at_70%_80%,#a7f3d0,transparent_40%),radial-gradient(circle_at_30%_70%,#fde68a,transparent_40%)] opacity-80" /> */}

      {/* <div className="absolute w-[600px] h-[600px] rounded-full bg-white/30 blur-[80px] top-[-150px] left-[-150px]" /> */}
      {/* <div className="absolute w-[500px] h-[500px] rounded-full bg-pink-200/40 blur-[100px] top-[50px] right-[-150px] animate-float" /> */}

      {/* <div className="absolute inset-0 opacity-[0.05] bg-[url('/images/noise.png')]" /> */}

      <div className="relative z-10 grid sm:grid-cols-2 w-full max-w-screen-2xl lg:mx-50 mx-auto items-center">
        <div className="space-y-5">
          <h1 className="text-6xl font-bold">Master Your Craft.</h1>

          <h2 className="text-6xl font-bold bg-gradient-to-r from-[#828bf8] to-[#5d447f] bg-clip-text text-transparent">
            Accelerate Growth.
          </h2>

          <p className="text-lg text-gray-600">
            The ultimate learning management system designed specifically for tech teams.
          </p>

          <Button>Get Started</Button>
        </div>

        <div className="flex justify-center">
          <Image src="/images/landingPage/man-studying.png" alt="Hero" width={1000} height={600} />
        </div>
      </div>
    </div>
  );
}
