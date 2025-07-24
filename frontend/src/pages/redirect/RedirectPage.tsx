import { useSearchParams } from 'react-router-dom';
import Loader from '../../components/ui/Loader';
import MinimalDesign from './designs/MinimalDesign';
// --- 1. Import the new BrandedDesign component ---
import BrandedDesign from './designs/BrandedDesign';

// --- 2. Add the "branded" key to this object ---
const designs = {
  minimal: MinimalDesign,
  branded: BrandedDesign,
};

const RedirectPage = () => {
  const [searchParams] = useSearchParams();
  const destination = searchParams.get('to');
  const design = searchParams.get('design') || 'minimal';
  const duration = parseInt(searchParams.get('duration') || '3', 10);

  // This logic now works correctly because `designs['branded']` will find your new component
  const Component = designs[design] || designs.minimal;

  if (!destination) {
    return <div>Error: Destination URL not provided.</div>;
  }

  return <Component destination={destination} duration={duration} />;
};

export default RedirectPage;