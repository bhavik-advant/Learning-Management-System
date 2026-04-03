import TechTeamCard from './TechTeamCard';
import { RiStackFill } from 'react-icons/ri';
import { MdAssignmentAdd } from 'react-icons/md';
import { HiUserGroup } from 'react-icons/hi';
import { AiTwotoneControl } from 'react-icons/ai';

function TechTeams() {
  return (
    <div className="flex flex-col  justify-center items-center space-y-5">
      <h2 className="mb-4  text-center text-4xl font-bold">
        Engineered For {' '}
        <span className="bg-linear-to-r from-[#828bf8] to-[#5d447f] bg-clip-text text-transparent font-bold">
          Tech Teams
        </span>
      </h2>
      <p className="text-lg text-muted-foreground text-center">
        Everything you need to upskill your engineering, product, and design teams in one powerful
        platform.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TechTeamCard
          svg={<RiStackFill className="text-purple-400 h-6 w-6"/>}
          title="Structured Learning"
          description="Curated learning paths tailored to specific roles, from junior developers to senior architects."
        />
        <TechTeamCard
          svg={<MdAssignmentAdd className="text-purple-400 h-6 w-6"/>}
          title="Assignment Tracking"
          description="Seamlessly integrate with GitHub/GitLab to track code submissions and technical assignments."
        />
        <TechTeamCard
          svg={<HiUserGroup className="text-purple-400 h-6 w-6"/>}
          title="Mentor Workflows"
          description="Mentor Workflows Dedicated dashboards for mentors to review code, provide feedback, and track mentee progress."
        />
        <TechTeamCard
          svg={<AiTwotoneControl className="text-purple-400 h-6 w-6"/>}
          title="Granular Admin Control"
          description="Comprehensive analytics and reporting to monitor company-wide learning metrics and ROI."
        />
      </div>
    </div>
  );
}

export default TechTeams;
