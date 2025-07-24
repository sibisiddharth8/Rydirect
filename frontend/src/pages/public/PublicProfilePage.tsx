import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPublicLinks } from '../../api/publicService'; // Create this new service file
import Loader from '../../components/ui/Loader';

const PublicProfilePage = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await getPublicLinks();
        setLinks(data);
      } catch (error) {
        console.error("Failed to fetch public links", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-12">
      <div className="w-full max-w-2xl mx-auto px-4">
        <header className="text-center mb-12">
          {/* You can make this dynamic later from a user profile API */}
          <img src="https://placehold.co/128x128/3b82f6/ffffff?text=S" alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg" />
          <h1 className="text-4xl font-bold text-slate-800">Sibi Siddharth</h1>
          <p className="text-slate-600 mt-2">My corner of the internet. Connect with me below!</p>
        </header>

        <main className="space-y-4">
          {links.map((link, index) => (
            <motion.a
              key={link.shortCode}
              href={`${import.meta.env.VITE_LINKS_BASE_URL}/${link.shortCode}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="block w-full p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-center font-semibold text-slate-700"
            >
              {link.name}
            </motion.a>
          ))}
        </main>
      </div>
    </div>
  );
};

export default PublicProfilePage;