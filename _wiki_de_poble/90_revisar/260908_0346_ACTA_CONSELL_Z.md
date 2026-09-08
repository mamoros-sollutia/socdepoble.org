# 🛡️ ACTA DEL CONSELL: VEREDICTE Z

**Data:** 8 de setembre de 2026
**Estat:** NO-GO (Fins a verificació de la Porta)
**Font:** Z (via Mestre Javi)

---

## 1. Veredicte Final

**GO CONDICIONAT A EVIDÈNCIA OBJECTIVA.**
Z es nega a donar un GO per "confiança". Demana que es resolguen primer les incidències trobades i després executar una llista de controls estricta. Si la llista de controls ix tota verda, el GO s'emet per delegació i es va a producció directament.

## 2. Monolits

**DECISIÓ: NO ELS TOQUES ABANS DE PRODUCCIÓ.**
- Argument: `UniversalComponents.jsx` (45 KB) no bloqueja el *runtime*. Vite l'empaqueta sense problemes. 
- Obligació: El Trellat de posposar-ho s'ha de registrar. Demana congelar el monòlit per decret i registrar-ho a `.monolits-deute.json`. A partir d'ara, res de codi nou pot anar als monolits.

## 3. Carpeta `03_Actuar`

**VEREDICTE: SÍ com a registre, NO com a casa de codi.**
Aprova la carpeta exclusivament com a anell per a documentació curta (fitxes amb nivells de risc) que apunten al codi. El codi executable queda a `scripts/` i `.agents/skills/`.

## 4. Instruccions Urgents (Prèvies al GO)

1. **Manifest:** Arreglar l'assumpte de la funció de hash i verificar `436/436` coincidents.
2. **Clau de servei:** Buscar amb `grep` que no hi haja cap rastre de `service_role` al client. (Tolerància zero).
3. **Pedaços SQL:** Provar exhaustivament les regles RLS a staging abans de refiar-se'n.
4. **Marc Legal:** La política de privacitat i l'acord amb Sollutia (DPA) han d'estar signats abans que cap usuari real entre al Mas.
5. **Neteja:** Fer els 4 greps indicats per verificar l'aturador online, els storages i el codi dur.
