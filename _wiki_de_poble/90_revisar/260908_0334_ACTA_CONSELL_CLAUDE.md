# 🛡️ ACTA DEL CONSELL: VEREDICTE CLAUDE

**Data:** 8 de setembre de 2026
**Estat:** NO-GO
**Font:** Claude (via Mestre Javi)

---

## 1. Troballes Crítiques (NO-GO)

Claude ha fet una auditoria destructiva profunda contra el codi real (més enllà del manifest) i ha trobat 4 bloquejos crítics que els altres havien passat per alt:

1. **Xat i Mur aïllats:** `loadMur()` filtra per `owner_user_id=eq.`. Açò vol dir que al Mur, Mercat i Esdeveniments els usuaris només veuen allò que ells mateixos han escrit. La RLS és correcta, però el client filtra malament (una línia a canviar).
2. **Alta d'usuaris amb codi mort:** A `handle_new_user`, les excepcions `SDP-REG-001/002/003` estan atrapades tres línies més avall dins de l'`exception when others`. Açò fa que una alta puga quedar sense `town_memberships` i la persona veja una app buida sense error. Les validacions són codi mort.
3. **Analítica Incoherent:** `index.html:16` carrega Umami. El `TelemetryDashboard` està actiu. Això contradiu la política de privacitat i la Constitució §6 ("prohibició total i absoluta" d'analítiques).
4. **Tests Fantasmes:** Els 4 tests existents fan referència a `/home/claude/repo/...` (sandbox d'IA), fan un mock de `AppDataContext.jsx` (que no existeix) i no s'executen mai a les 38 portes (falta `vitest` a la cadena de portes). Són al·lucinacions d'auditories prèvies.

## 2. Pedaços de Seguretat (Fase 1 i 2)

**Veredicte:** Ben fets. Tot i el NO-GO pels bloquejos de dalt, els pedaços en si (RLS i OAuth) estan ben implementats. 
- *Avís de divergència:* Ens adverteix que `schema.sql` i la migració divergeixen i el README diu que s'ha d'aplicar `schema.sql` (que no té el pedaç d'immutabilitat que vam posar a la migració).

## 3. Avaluació dels Monolits

**Veredicte:** Posposar va ser correcte, però adverteix que *sense proves que s'executen no tenim xarxa*. Primer arreglar tests, després el trossejament. Ens dóna una pista que `UniversalPage` és el centre d'una estrela i es poden llevar 700 línies sense tocar-lo en 5 onades. Fins i tot ha validat la teoria amb un script AST (Babel parser).

## 4. Pregunta Arquitectònica: Carpeta `03_Actuar`

**Veredicte:** NO.
Indica que un índex escrit a mà derivarà i quedarà obsolet (segona font de veritat), igual que ha passat amb `schema.sql` vs la migració. Un índex ha de ser GENERAT dins de `02_Saber` usant un script lligat a la cadena de portes amb `--check`. Deriva impossible per construcció, un sol fitxer al RAG.
