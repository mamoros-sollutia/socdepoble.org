import { useState, useEffect } from 'react';
import { loadGestoria, teCapacitat } from '../../../data/backendPort.js';

const formatEur = (num) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(num);

const CATEGORIES = [
  [['CEPSA', 'REPSOL'], 'Gasolinera i Transport'],
  [['SOM ENERGIA', 'IBERDROLA'], 'Subministraments'],
  [['SUMA', 'SEGUROS'], 'Assegurances i Impostos'],
  [['BAR ', 'RTE.'], 'Oci i Restauració'],
  [['SUPERMERCADO', 'MERCADONA'], 'Supermercat'],
];

/** Pura: entren moviments, ix el quadre. Sense backend, testable a soles. */
export function calculaQuadre({ events = [], factures = [], contactes = [], documents = [] }) {
  let saldo = 0, totalDespeses = 0;
  const agrupats = {};

  for (const e of events) {
    const import_ = Number(e.amount) || 0;
    saldo += import_;
    if (import_ >= 0) continue;
    totalDespeses += Math.abs(import_);
    const concepte = String(e.clean_concept || e.concept || '').toUpperCase();
    const cat = CATEGORIES.find(([claus]) => claus.some(k => concepte.includes(k)))?.[1]
      || 'Altres Despeses';
    (agrupats[cat] ||= []).push(e);
  }

  const despesaMensual = totalDespeses > 0 ? totalDespeses / 3 : 1000;
  return {
    saldo, saldoFormatted: formatEur(saldo),
    mesosRebost: (saldo / despesaMensual).toFixed(1),
    agrupats, totalDespeses, factures, contactes, documents, events, formatEur,
  };
}

export function useGestoriaData() {
  const disponible = teCapacitat('gestoria');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(disponible);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!disponible) { setLoading(false); return; }
    const control = new AbortController();
    let viu = true;

    loadGestoria({ signal: control.signal })
      .then(cru => { if (viu) setData(calculaQuadre(cru || {})); })
      .catch(e => {
        if (!viu || e.name === 'AbortError') return;
        console.error('[gestoria] càrrega fallida', e);
        setError(e);
      })
      .finally(() => { if (viu) setLoading(false); });

    return () => { viu = false; control.abort(); };
  }, [disponible]);

  return { data, loading, error, disponible };
}
