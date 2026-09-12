import React, { useState } from 'react';
import { UniversalPage } from '../../../components/universal/UniversalPage';
import { PillToggle } from '../../../components/ui/PillToggle';
import { useGestoriaData } from '../hooks/useGestoriaData';

export default function GestoriaFacturacio() {
  const { data, loading } = useGestoriaData();
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [vistaComprimida, setVistaComprimida] = useState(false);

  if (loading) {
    return (
      <UniversalPage title="Facturació" chrome="none">
        <div className="sdp-carregant" role="status" aria-live="polite">
          <p className="sdp-carregant">Carregant factures...</p>
        </div>
      </UniversalPage>
    );
  }

  const { formatEur } = data;
  let factures = [...(data.factures || [])];

  if (filter !== 'ALL') {
    factures = factures.filter((factura) => factura.type === filter);
  }

  if (search.trim()) {
    const consulta = search.trim().toLowerCase();
    factures = factures.filter((factura) => (
      factura.contact_name?.toLowerCase().includes(consulta)
      || factura.id?.toLowerCase().includes(consulta)
    ));
  }

  factures.sort((a, b) => b.date_timestamp - a.date_timestamp);

  return (
    <UniversalPage chrome="system"
      title="FACTURACIÓ"
      labels={["GESTORIA", "PANELL INTERN"]}
    >
      <section className="content-wrapper" aria-labelledby="gestoria-facturacio-titol">
        <h2 id="gestoria-facturacio-titol">
          Registre unificat de vendes i compres
        </h2>

        <div className="sdp-camp">
          <PillToggle
            etiqueta="Filtres de facturació"
            valor={filter}
            onCanvi={(v) => setFilter(v)}
            opcions={[
              { valor: 'ALL', text: 'Tot' },
              { valor: 'INGRES', text: 'Vendes' },
              { valor: 'GASTO', text: 'Compres' }
            ]}
          />
        </div>
        
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

        <form
          className="form-trellat"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="sdp-camp">
            <label htmlFor="gestoria-cerca-factures">Cerca factures</label>
            <input
              id="gestoria-cerca-factures"
              className="sdp-control"
              type="search"
              placeholder="Nom, NIF o número de document"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </form>

        <div className="sdp-alerta__accions sdp-accions--final">
          <button className="sdp-boto sdp-boto--accent" type="button">
            Nova factura
          </button>
        </div>

        <div
          className="sdp-taula"
          tabIndex="0"
          aria-label="Factures: desplaçament horitzontal"
        >
          <table className={`sdp-taula sdp-taula--interactiva sdp-taula--ampla ${vistaComprimida ? 'sdp-taula--densa' : ''}`}>
            <caption>Factures registrades</caption>
            <thead>
              <tr>
                <th scope="col">Tipus</th>
                <th scope="col">Data</th>
                <th scope="col">Número de document</th>
                <th scope="col">Client o proveïdor</th>
                <th scope="col">Concepte</th>
                <th className="sdp-num" scope="col">Total</th>
                <th scope="col">Estat</th>
              </tr>
            </thead>
            <tbody>
              {factures.length === 0 ? (
                <tr>
                  <td className="sdp-gestor-buit" colSpan="7">
                    Sense documents per mostrar. Usa l’escàner o canvia els filtres.
                  </td>
                </tr>
              ) : (
                factures.map((factura, index) => {
                  const esVenda = factura.type === 'INGRES';
                  const conciliada = factura.estat_conciliacio === 'CONCILIAT';

                  return (
                    <tr key={factura.id || index}>
                      <td>
                        <span
                          className={`sdp-insignia ${esVenda ? 'sdp-insignia--exit' : 'sdp-insignia--info'}`}
                        >
                          {esVenda ? 'Venda' : 'Compra'}
                        </span>
                      </td>
                      <td>{new Date(factura.date_timestamp).toLocaleDateString()}</td>
                      <th scope="row">{factura.id}</th>
                      <td>{factura.contact_name || factura.contact_nif}</td>
                      <td>{factura.desc}</td>
                      <td className="sdp-num">{formatEur(factura.total)}</td>
                      <td>
                        <span
                          className={`sdp-insignia ${conciliada ? 'sdp-insignia--exit' : 'sdp-insignia--avis'}`}
                        >
                          {factura.estat_conciliacio}
                        </span>
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
