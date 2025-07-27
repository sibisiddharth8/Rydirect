import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import { SearchX } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center text-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <SearchX className="mx-auto h-16 w-16 text-slate-400" />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl">
          404 - Link Not Found
        </h1>
        <p className="mt-4 text-base text-slate-600">
          Sorry, we couldn’t find the link you’re looking for.
        </p>
        <div className="mt-10">
          <Link to="/">
            <Button>
              Go Back Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;