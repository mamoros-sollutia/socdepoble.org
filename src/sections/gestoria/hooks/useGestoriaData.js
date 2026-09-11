import { useState, useEffect } from 'react';
import { db } from '../lib/db';

export function useGestoriaData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDades() {
      try {
        const events = await db.events.toArray();
        const factures = await db.factures.toArray();
        const contactes = await db.contactes.toArray();
        const documents = await db.documents ? await db.documents.toArray() : [];

        let saldo = 0;
        let agrupats = {};
        let totalDespeses = 0;

        events.forEach(e => {
          saldo += e.amount;
          if (e.amount < 0) {
            totalDespeses += Math.abs(e.amount);
            let cat = "Altres Despeses";
            const concept = (e.clean_concept || e.concept || "").toUpperCase();
            if (concept.includes("CEPSA") || concept.includes("REPSOL")) cat = "Gasolinera i Transport";
            else if (concept.includes("SOM ENERGIA") || concept.includes("IBERDROLA")) cat = "Subministraments";
            else if (concept.includes("SUMA") || concept.includes("SEGUROS")) cat = "Assegurances i Impostos";
            else if (concept.includes("BAR ") || concept.includes("RTE.")) cat = "Oci i Restauració";
            else if (concept.includes("SUPERMERCADO") || concept.includes("MERCADONA")) cat = "Supermercat";

            if (!agrupats[cat]) agrupats[cat] = [];
            agrupats[cat].push(e);
          }
        });

        let despesaMensual = totalDespeses > 0 ? (totalDespeses / 3) : 1000;
        let mesosRebost = (saldo / despesaMensual).toFixed(1);

        // Format eur function
        const formatEur = (num) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(num);

        setData({
          saldo,
          saldoFormatted: formatEur(saldo),
          mesosRebost,
          agrupats,
          totalDespeses,
          factures,
          contactes,
          documents,
          events,
          formatEur
        });
      } catch (e) {
        console.error("Error carregant dades de Dexie", e);
      } finally {
        setLoading(false);
      }
    }

    carregarDades();
  }, []);

  return { data, loading };
}
