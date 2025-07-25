import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPublicLinks } from '../../api/publicService'; // Ensure this import is correct
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader text="Loading links..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-12 sm:py-24">
      <div className="w-full max-w-2xl mx-auto px-4">
        <header className="text-center mb-12">
          <img 
            src="https://placehold.co/128x128/3b82f6/ffffff?text=S" 
            alt="Profile" 
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg" 
          />
          <h1 className="text-4xl font-bold text-slate-800">Sibi Siddharth</h1>
          <p className="text-slate-600 mt-2">My corner of the internet. Connect with me below!</p>
        </header>

        <motion.main 
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {links.length > 0 ? (
            links.map((link) => (
              <motion.a
                key={link.shortCode}
                href={`${import.meta.env.VITE_LINKS_BASE_URL}/${link.shortCode}`}
                target="_blank"
                rel="noopener noreferrer"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="block w-full p-5 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all text-center font-semibold text-slate-700 text-lg"
              >
                {link.name}
              </motion.a>
            ))
          ) : (
            <p className="text-center text-slate-500">No public links available yet.</p>
          )}
        </motion.main>
      </div>
    </div>
  );
};

export default PublicProfilePage;