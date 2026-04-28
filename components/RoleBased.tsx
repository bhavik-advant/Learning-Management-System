type Role = 'ADMIN' | 'MENTOR' | 'TRAINEE';

type Props = {
  role: Role;
  components: Record<Role, React.ComponentType>;
};

export default function RoleBased({ role, components }: Props) {
  const Component = components[role];

  if (!Component) return <div>No Access</div>;

  return <Component />;
}
