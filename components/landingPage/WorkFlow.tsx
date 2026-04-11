import { FiUserPlus, FiFileText, FiMessageCircle } from 'react-icons/fi';
import { CiCircleCheck } from 'react-icons/ci';
import { IoMdTrendingUp } from 'react-icons/io';
const steps = [
  {
    icon: FiUserPlus,
    title: 'Trainee Joins Course',
    description: 'Onboard to structured learning path',
  },
  {
    icon: FiFileText,
    title: 'Mentor Assigns Content',
    description: 'Curated materials and projects',
  },
  {
    icon: CiCircleCheck,
    title: 'Trainee Submits Work',
    description: 'Complete assignments and projects',
  },
  {
    icon: FiMessageCircle,
    title: 'Mentor Reviews & Scores',
    description: 'Detailed feedback and evaluation',
  },
  {
    icon: IoMdTrendingUp,
    title: 'Admin Tracks Progress',
    description: 'Monitor performance and analytics',
  },
];

export default function Workflow() {
  return (
    <section id="workflow" className="pb-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-4xl font-bold">
            How It{' '}
            <span className="bg-linear-to-r from-[#828bf8] to-[#5d447f] bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-lg  ">A seamless workflow from onboarding to mastery</p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0  h-full w-0.5  bg-linear-to-b from-blue-500 via-purple-500 to-indigo-500 opacity-20 hidden sm:block" />

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-8 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`group inline-block rounded-2xl border border-white dark:border-[#828bf8]/50 shadow-2xl shadow-gray-400 dark:shadow-none p-7 backdrop-blur-sm transition-all hover:border-purple-500/30 hover:shadow-md hover:shadow-purple-500/10 ${
                      index % 2 === 0 ? 'sm:ml-auto' : 'sm:mr-auto'
                    }`}
                    style={{ maxWidth: '520px' }}
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-500/20 to-purple-500/20 ring-1 ring-white/10">
                      <step.icon className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="mb-2 font-semibold">{step.title}</h3>
                    <p className="text-sm  ">{step.description}</p>
                  </div>
                </div>

                <div className="relative z-10  ">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 z-10 border-purple-500/40 bg-white shadow-md shadow-purple-500/10">
                    <span className="bg-linear-to-br from-blue-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
                      {index + 1}
                    </span>
                  </div>
                </div>

                <div className="hidden flex-1 sm:block " />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
