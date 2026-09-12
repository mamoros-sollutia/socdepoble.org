import React from 'react';
import { UniversalPage } from '../../../components/universal/UniversalPage';

const DOCUMENTS_PROCESSATS = [
  {
    id: 'factura-apple-mar-2026',
    arxiu: 'Factura_Apple_Mar26.pdf',
    data: '15/03/2026',
    contacte: 'Apple Store España',
    base: '1.000,00 €',
    iva: '210,00 €',
    total: '1.210,00 €',
    estat: '1T 2026',
    variant: 'avis',
  },
  {
    id: 'factura-sollutia-hosting-2026',
    arxiu: 'F24_Sollutia_Hosting.pdf',
    data: '02/04/2026',
    contacte: 'Sollutia S.L.',
    base: '150,00 €',
    iva: '31,50 €',
    total: '181,50 €',
    estat: '2T 2026',
    variant: 'avis',
  },
  {
    id: 'cajamar-moviments-2026',
    arxiu: 'Cajamar_Moviments.csv',
    data: '30/06/2026',
    contacte: 'Caixa Rural Central',
    base: '—',
    iva: '—',
    total: '45 moviments',
    estat: 'Conciliat',
    variant: 'exit',
  },
];

export default function GestoriaIngesta() {
  return (
    <UniversalPage chrome="system"
      title="ESCÀNER LOCAL"
      labels={["GESTORIA", "PANELL INTERN"]}
    >
      <section className="content-wrapper" aria-labelledby="gestoria-ingesta-titol">
        <h2 id="gestoria-ingesta-titol">Motor d’ingesta</h2>

        <section aria-labelledby="gestoria-pujada-titol">
          <h3 id="gestoria-pujada-titol">Importa el banc o les factures</h3>
          <label className="upload-zone" htmlFor="gestoria-arxius">
            <span aria-hidden="true">📥</span>
            <strong>Llança els arxius ací o prem per seleccionar-los</strong>
            <span>Admet CSV, PDF i imatges de factures.</span>
            <input
              id="gestoria-arxius"
              className="sdp-control"
              type="file"
              accept=".csv,text/csv,application/pdf,image/*"
              multiple
            />
          </label>
        </section>

        <section aria-labelledby="gestoria-tramits-titol">
          <h3 id="gestoria-tramits-titol">Tràmits</h3>
          <div className="sdp-alerta__accions">
            <button className="sdp-boto sdp-boto--primari" type="button">
              <span aria-hidden="true">📊</span>
              Generar CSV per a la gestoria
            </button>
            <button className="sdp-boto sdp-boto--accent" type="button">
              <span aria-hidden="true">🧙</span>
              Preguntar al Consell
            </button>
          </div>
        </section>

        <section aria-labelledby="gestoria-documents-titol">
          <div className="sdp-alerta__accions">
            <h3 id="gestoria-documents-titol">
              Últims documents processats — 2T 2026
            </h3>
            <span className="sdp-insignia sdp-insignia--exit">
              Tots classificats correctament
            </span>
          </div>

          <div
            className="sdp-taula"
            tabIndex="0"
            aria-label="Documents processats: desplaçament horitzontal"
          >
            <table className="sdp-taula">
              <caption>Documents processats durant el segon trimestre de 2026</caption>
              <thead>
                <tr>
                  <th scope="col">Arxiu original</th>
                  <th scope="col">Data</th>
                  <th scope="col">Proveïdor o client</th>
                  <th className="sdp-num" scope="col">Base imposable</th>
                  <th className="sdp-num" scope="col">IVA</th>
                  <th className="sdp-num" scope="col">Total</th>
                  <th scope="col">Estat</th>
                </tr>
              </thead>
              <tbody>
                {DOCUMENTS_PROCESSATS.map((document) => (
                  <tr key={document.id}>
                    <th scope="row">{document.arxiu}</th>
                    <td>{document.data}</td>
                    <td>{document.contacte}</td>
                    <td className="sdp-num">{document.base}</td>
                    <td className="sdp-num">{document.iva}</td>
                    <td className="sdp-num">{document.total}</td>
                    <td>
                      <span className={`sdp-insignia sdp-insignia--${document.variant}`}>
                        {document.estat}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </UniversalPage>
  );
}
