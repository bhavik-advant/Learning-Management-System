function TechTeamCard({ title, description, svg }) {
  return (
    <div className="rounded-2xl border border-white shadow-2xl shadow-gray-400 p-7 backdrop-blur-sm transition-all hover:border-purple-500/30 hover:shadow-md hover:shadow-purple-500/10 space-y-5">
      <div className=" inline-flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-500/20 to-purple-500/20 ring-1 ring-white/10 ">
        <span>{svg}</span>
      </div>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-lg">{description}</p>
    </div>
  );
}

export default TechTeamCard;
