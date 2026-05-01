const AnalyticsOverview = () => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-semibold mb-6">Analytics Overview</h2>

      <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
        <p className="text-slate-500 font-medium">Recharts will go here!</p>
        <p className="text-sm text-slate-400 mt-2">
          (Awaiting Microservice B connection)
        </p>
      </div>
    </section>
  );
};

export default AnalyticsOverview;
