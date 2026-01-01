const KpiCards = ({ title, value }) => {
  return (
    <div className="bg-white p-4 shadow text-center rounded-xl">
      <p className="text-gray-500 font-medium">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
};

export default KpiCards;
