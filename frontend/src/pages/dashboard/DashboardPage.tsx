import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link as LinkIcon, BarChart2, CheckCircle, Clock } from 'lucide-react';

import { getDashboardStats, getTopLinks, getRecentLinks } from '../../api/dashboardService';
import StatCard from '../../components/dashboard/StatCard';
import InfoList from '../../components/dashboard/InfoList';

import Loader from '../../components/ui/Loader';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [topLinks, setTopLinks] = useState([]);
  const [recentLinks, setRecentLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, topLinksData, recentLinksData] = await Promise.all([
          getDashboardStats(),
          getTopLinks(),
          getRecentLinks()
        ]);
        
        setStats(statsData);

        // Format data for the InfoList component
        setTopLinks(topLinksData.map(link => ({
          primary: link.name,
          secondary: `/${link.shortCode}`,
          value: link.clickCount
        })));
        
        setRecentLinks(recentLinksData.map(link => ({
          primary: link.name,
          secondary: `Created on ${new Date(link.createdAt).toLocaleDateString()}`,
          value: '' // No value needed for recent links
        })));

      } catch (err) {
        setError("Failed to fetch dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader text="Loading dashboard data..." />;
  if (error) return <div className="w-full text-center text-red-500">{error}</div>;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
      
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Links" value={stats.links.total} icon={LinkIcon} color="#3b82f6" />
        <StatCard title="Total Clicks" value={stats.clicks.total} icon={BarChart2} color="#22c55e" />
        <StatCard title="Active Links" value={stats.links.active} icon={CheckCircle} color="#14b8a6" />
        <StatCard title="Paused Links" value={stats.links.paused} icon={Clock} color="#f97316" />
      </div>

      {/* Info Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfoList title="Top Performing Links" items={topLinks} />
        <InfoList title="Recent Activity" items={recentLinks} />
      </div>

    </motion.div>
  );
};

export default DashboardPage;