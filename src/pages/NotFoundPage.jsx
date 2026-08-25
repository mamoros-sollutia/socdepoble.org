import { useAppData } from '../app/AppDataContext';
import SectionChrome from '../components/SectionChrome';
import { useSEO } from '../hooks/useSEO';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  const { t } = useAppData();
  
  useSEO({
    title: '404 - No Trobat',
    description: 'La pàgina que cerques no existeix o ha estat moguda.',
    status: 404,
    index: false
  });

  return (
    <SectionChrome
      kicker="Error 404"
      title="Ací no hi ha res"
      subtitle="La pàgina que busques no existeix o ha canviat de lloc."
      meta={['404', 'No trobat']}
    >
      <div className="sdp-text-center sdp-mt-8">
        <Compass size={48} className="sdp-mx-auto sdp-mb-4 sdp-text-suau" />
        <p className="sdp-mb-6">
          Pots tornar a l'inici per seguir explorant Sóc de Poble.
        </p>
        <Link to="/" className="sdp-btn">
          Tornar a l'inici
        </Link>
      </div>
    </SectionChrome>
  );
}
