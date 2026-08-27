import { useAppData } from '../app/AppDataContext';
import { UniversalPage } from '../components/universal/UniversalComponents';
import { useSEO } from '../hooks/useSEO';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  
  useSEO({
    title: '404 - No Trobat',
    description: 'La pàgina que cerques no existeix o ha estat moguda.',
    status: 404,
    index: false
  });

  return (
    <UniversalPage
      title="Ací no hi ha res"
      subtitle="Error 404"
      lead="La pàgina que busques no existeix o ha canviat de lloc."
      labels={['404', 'No trobat']}
    >
      <div className="page-intro sdp-text-center">
        <Compass size={48} className="sdp-text-suau" />
        <p>
          Pots tornar a l'inici per seguir explorant Sóc de Poble.
        </p>
        <p>
          <Link to="/" className="btn btn-primary">
            Tornar a l'inici
          </Link>
        </p>
      </div>
    </UniversalPage>
  );
}
