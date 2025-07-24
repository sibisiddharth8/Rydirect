const AnalyticsTable = ({ title, data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3">Source</th>
              <th scope="col" className="px-6 py-3 text-right">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-slate-800 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 font-bold text-slate-800 text-right">{item.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsTable;