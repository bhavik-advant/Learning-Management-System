function TechTeamCard({ title, description, svg }) {
  return (
    <div className="p-4 border border-black rounded-md space-y-5">
      <div className="p-2 border border-black w-16 text-2xl flex justify-center items-center rounded-md">
        {svg}
      </div>
      <h1 className="text-2xl">{title}</h1>
      <p className="text-lg">{description}</p>
    </div>
  );
}

export default TechTeamCard;
