import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getClicksData, getGeoData, getReferrersData } from '../../api/analyticsService';
import Loader from '../../components/ui/Loader';
import AnalyticsChart from '../../components/analytics/AnalyticsChart';
import AnalyticsTable from '../../components/analytics/AnalyticsTable';

const AnalyticsPage = () => {
  const [clicksData, setClicksData] = useState([]);
  const [geoData, setGeoData] = useState([]);
  const [referrersData, setReferrersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [clicks, geo, referrers] = await Promise.all([
          getClicksData(),
          getGeoData(),
          getReferrersData(),
        ]);
        setClicksData(clicks);
        setGeoData(geo);
        setReferrersData(referrers);
      } catch (err) {
        setError('Failed to load analytics data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader text="Crunching the numbers..." />;
  if (error) return <div className="w-full text-center text-red-500">{error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h1 className="text-3xl font-bold text-slate-800">Analytics</h1>
      
      <AnalyticsChart data={clicksData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnalyticsTable title="Top Countries" data={geoData} />
        <AnalyticsTable title="Top Referrers" data={referrersData} />
      </div>
    </motion.div>
  );
};

export default AnalyticsPage;