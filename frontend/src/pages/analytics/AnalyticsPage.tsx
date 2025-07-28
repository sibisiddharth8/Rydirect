import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getClicksData, getGeoData, getReferrersData } from '../../api/analyticsService';
import Loader from '../../components/ui/Loader';
import AnalyticsChart from '../../components/analytics/AnalyticsChart';
import AnalyticsTable from '../../components/analytics/AnalyticsTable';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/analytics/StatCard';
import { BarChart2, Globe, Link2 } from 'lucide-react';

const AnalyticsPage = () => {
  const [data, setData] = useState({ clicks: [], geo: [], referrers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('7d'); // '7d', '30d', 'all'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [clicks, geo, referrers] = await Promise.all([
          getClicksData(period),
          getGeoData(period),
          getReferrersData(period),
        ]);
        setData({ clicks, geo, referrers });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  const totalClicks = useMemo(() => data.clicks.reduce((sum, item) => sum + item.clicks, 0), [data.clicks]);
  const topCountry = useMemo(() => data.geo[0]?.name || 'N/A', [data.geo]);
  const topReferrer = useMemo(() => data.referrers[0]?.name || 'N/A', [data.referrers]);

  return (
    <div className="space-y-8">
      <PageHeader title="Analytics">
      </PageHeader>
      <div className='flex sm:justify-end justify-center mb-4'>
          <div className="w-fit flex bg-white rounded-full p-1 shadow-sm border border-slate-200 items-center">
            {['7d', '30d', 'all'].map(p => (
                <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`cursor-pointer px-3 py-2 rounded-full text-sm font-semibold transition-colors ${
                        period === p ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    {p === 'all' ? 'All Time' : `Last ${p.replace('d', '')} Days`}
                </button>
            ))}
        </div>
        </div>

      {loading ? <Loader text="Crunching the numbers..." /> : error ? <div className="text-center text-red-500">{error}</div> : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Clicks" value={totalClicks} icon={BarChart2} color="text-blue-500" note={`in the last ${period === 'all' ? 'all time' : period.replace('d', ' days')}`} />
            <StatCard title="Top Country" value={topCountry} icon={Globe} color="text-green-500" note={data.geo[0] ? `${data.geo[0].clicks} clicks` : ''} />
            <StatCard title="Top Referrer" value={topReferrer} icon={Link2} color="text-indigo-500" note={data.referrers[0] ? `${data.referrers[0].clicks} clicks` : ''} />
          </div>
          
          <AnalyticsChart data={data.clicks} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnalyticsTable title="Clicks by Country" data={data.geo} />
            <AnalyticsTable title="Clicks by Referrer" data={data.referrers} />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AnalyticsPage;