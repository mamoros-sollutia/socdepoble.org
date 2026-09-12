import React from 'react';
import { UniversalPage } from '../../../components/universal/UniversalPage';
import { PillToggle } from '../../../components/ui/PillToggle';
import { useGestoriaData } from '../hooks/useGestoriaData';

export default function GestoriaContactes() {
  const { data, loading } = useGestoriaData();
  const [vistaComprimida, setVistaComprimida] = React.useState(false);

  if (loading) {
    return (
      <UniversalPage title="Contactes" chrome="none">
        <div className="sdp-carregant" role="status" aria-live="polite">
          <p className="sdp-carregant">Carregant contactes...</p>
        </div>
      </UniversalPage>
    );
  }

  const contactes = data.contactes || [];

  return (
    <UniversalPage chrome="system"
      title="CONTACTES"
      labels={["GESTORIA", "PANELL INTERN"]}
    >
      <section className="content-wrapper" aria-labelledby="gestoria-contactes-titol">
        <h2 id="gestoria-contactes-titol">El CRM poble-first — Llibre Major</h2>

        <div className="sdp-camp">
          <PillToggle
            etiqueta="Vista de la taula"
            valor={vistaComprimida ? 'COMPACTA' : 'NORMAL'}
            onCanvi={(v) => setVistaComprimida(v === 'COMPACTA')}
            opcions={[
              { valor: 'NORMAL', text: 'Universal Cards' },
              { valor: 'COMPACTA', text: 'Vista Comprimida' }
            ]}
          />
        </div>

        <div
          className="sdp-taula"
          tabIndex="0"
          aria-label="Contactes: desplaçament horitzontal"
        >
          <table className={`sdp-taula sdp-taula--interactiva ${vistaComprimida ? 'sdp-taula--densa' : ''}`}>
            <caption>Contactes del Llibre Major</caption>
            <thead>
              <tr>
                <th scope="col">Nom o raó social</th>
                <th scope="col">NIF o CIF</th>
                <th scope="col">Tipus</th>
                <th className="table-action" scope="col">Accions</th>
              </tr>
            </thead>
            <tbody>
              {contactes.length === 0 ? (
                <tr>
                  <td className="sdp-gestor-buit" colSpan="4">
                    Sense contactes al Llibre Major.
                  </td>
                </tr>
              ) : (
                contactes.map((contacte, index) => {
                  const esClient = contacte.tipus === 'CLIENT';

                  return (
                    <tr key={contacte.id || contacte.nif || index}>
                      <th scope="row">{contacte.nom}</th>
                      <td>{contacte.nif}</td>
                      <td>
                        <span
                          className={`sdp-insignia ${esClient ? 'sdp-insignia--exit' : 'sdp-insignia--info'}`}
                        >
                          {contacte.tipus}
                        </span>
                      </td>
                      <td className="table-action">
                        <button className="sdp-boto" type="button">
                          Editar
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </UniversalPage>
  );
}
