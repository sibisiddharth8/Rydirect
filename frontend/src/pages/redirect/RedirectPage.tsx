import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Loader from '../../components/ui/Loader';
import MinimalDesign from './designs/MinimalDesign';
import BrandedDesign from './designs/BrandedDesign';
import CompanyDesign from './designs/CompanyDesign';
import { getPublicLinkByShortCode, getPublicProfile, getPublicLinks } from '../../api/publicService';

const designs = {
  minimal: MinimalDesign,
  branded: BrandedDesign,
  company: CompanyDesign,
};

const RedirectPage = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState({ link: null, user: null, publicLinks: [] });
  const [loading, setLoading] = useState(true);

  const destination = searchParams.get('to');
  const design = searchParams.get('design') || 'minimal';
  const duration = parseInt(searchParams.get('duration') || '5', 10);
  const shortCode = searchParams.get('shortCode');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [linkData, userData, publicLinksData] = await Promise.all([
          shortCode ? getPublicLinkByShortCode(shortCode) : Promise.resolve(null),
          getPublicProfile(),
          getPublicLinks(),
        ]);
        setData({ link: linkData, user: userData, publicLinks: publicLinksData });
      } catch (err) {
        console.error("Failed to fetch redirect data", err);
      } finally {
        setLoading(false);
      }
    };

    if (destination && shortCode) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [destination, shortCode]);

  const Component = designs[design] || designs.minimal;

  if (!destination) {
    return (
        <div className="w-full h-screen flex items-center justify-center p-4">
            <p className="text-red-500 font-semibold">Error: Destination URL not provided.</p>
        </div>
    );
  }
  
  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center"><Loader /></div>;
  }

  return <Component 
    destination={destination} 
    duration={duration} 
    link={data.link}
    user={data.user}
    publicLinks={data.publicLinks}
  />;
};

export default RedirectPage;