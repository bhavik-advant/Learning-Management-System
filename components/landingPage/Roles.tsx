import RoleCard from './RoleCard';
import { FaChartPie, FaUserGraduate } from 'react-icons/fa';
import { FaChalkboardUser } from 'react-icons/fa6';
import traineeRoleImg from '@/assets/trainee-role.png';
import mentorRoleImg from '@/assets/mentor-role.png';
import adminRoleImg from '@/assets/admin-role.png';

function Roles() {
  return (
    <div className="flex flex-col  justify-center items-center py-14">
      <h2 className="mb-4  text-center text-4xl font-bold">
        Designed for{' '}
        <span className="bg-linear-to-r from-[#828bf8] to-[#5d447f] bg-clip-text text-transparent font-bold">
          Every Role
        </span>
      </h2>
      <p className="text-lg text-muted-foreground text-center pb-8">
        Customized interfaces that provide exactly what each user needs to succeed.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <RoleCard
          title="Trainee View"
          description="Focus on learning"
          text="Clean interface focusing on current courses, upcoming assignments, and progress tracking."
          svg={<FaUserGraduate className="text-purple-400 h-6 w-6" />}
          image={traineeRoleImg}
        />
        <RoleCard
          title="Mentor View"
          description="Focus on guiding"
          text="Tools for reviewing code submissions, scheduling 1-on-1s, and providing structured feedback."
          svg={<FaChalkboardUser className="text-purple-400 h-6 w-6" />}
          image={mentorRoleImg}
        />
        <RoleCard
          title="Admin View"
          description="Focus on metrics"
          text="High-level dashboards showing completion rates, engagement metrics, and resource allocation."
          svg={<FaChartPie className="text-purple-400 h-6 w-6" />}
          image={adminRoleImg}
        />
      </div>
    </div>
  );
}

export default Roles;
