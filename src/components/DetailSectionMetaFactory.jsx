import React from 'react';
import { contentBackendAdapter } from '../adapters/contentBackendAdapter.js';

/**
 * DetailSectionMetaFactory.jsx
 * 
 * Generador (Factory) per muntar "DetailSections" de manera dinàmica.
 * Evita el codi espagueti separant les dades de la UI i aplicant
 * els design tokens de Pedra Seca de manera automàtica a l'estructura.
 * 
 * Sollutia podrà injectar la seua pròpia configuració ací si cal.
 */

// Components de presentació "Pedra Seca" (ideals)
const Title = ({ children }) => <h2 className="sdp-font-heading-lg" style={{ color: 'var(--sdp-black-100)', marginBottom: 'var(--sdp-touch-min)' }}>{children}</h2>;
const Paragraph = ({ children }) => <p className="sdp-font-min" style={{ color: 'var(--sdp-neutre-500)', marginBottom: 'var(--sdp-touch-min)' }}>{children}</p>;
const Card = ({ children }) => (
  <div style={{
    backgroundColor: 'var(--sdp-white-100)',
    borderRadius: 'var(--sdp-radius-main)',
    padding: 'var(--sdp-touch-min)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    marginBottom: 'var(--sdp-touch-cuspide)'
  }}>
    {children}
  </div>
);

export function DetailSectionMetaFactory({ configId, fallbackData }) {
  const [data, setData] = React.useState(fallbackData);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Ex: si configId === 'entitats', demanar entitats
        const result = await contentBackendAdapter.getEntities(configId);
        setData(result);
      } catch (err) {
        console.error('[DetailSectionMetaFactory] Error carregant dades:', err);
        setError('No s\'han pogut carregar les dades.');
      } finally {
        setLoading(false);
      }
    }
    
    // Si no tenim fallbackData o estem forçant la recàrrega via Adapter
    if (!fallbackData || window.SOLLUTIA_ENV || window.WIKI_DEV) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [configId, fallbackData]);

  if (loading) {
    return <Card><Paragraph>Carregant secció...</Paragraph></Card>;
  }

  if (error) {
    return (
      <Card>
        <Title>Error</Title>
        <Paragraph style={{ color: 'var(--sdp-roig-error)' }}>{error}</Paragraph>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return <Card><Paragraph>Sense contingut disponible.</Paragraph></Card>;
  }

  // Renderització dirigida per metadades
  return (
    <div className="sdp-root">
      {data.map((item, index) => (
        <Card key={item.id || index}>
          {item.title && <Title>{item.title}</Title>}
          {item.description && <Paragraph>{item.description}</Paragraph>}
        </Card>
      ))}
    </div>
  );
}

export default DetailSectionMetaFactory;
