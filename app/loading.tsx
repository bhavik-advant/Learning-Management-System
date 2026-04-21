import { LuLoader } from 'react-icons/lu';

function loading() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <LuLoader className="text-8xl animate-spin" />
    </div>
  );
}

export default loading;
