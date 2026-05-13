const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="group rounded-xl bg-linear-to-br from-gray-50 to-gray-50/50 dark:from-gray-800/60 dark:to-gray-900/30 border border-gray-100 dark:border-gray-700/60 p-5 hover:border-violet-200 dark:hover:border-violet-900 transition-colors duration-200">
    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
      {label}
    </p>
    <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
  </div>
);

export default InfoCard;
