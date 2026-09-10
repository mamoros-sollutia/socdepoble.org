# Estudi Copilot: Auditoria Estructural
**Data:** 10 de setembre de 2026 (03:12)
**IA:** Github Copilot
**Origen:** Petorreta d'Auditoria Estructural

## Resum executiu
He llegit el paquet adjunt i he carregat les eines necessàries per fer una auditoria estructural profunda. A continuació tens una **auditoria inversa hiperdestructiva** però constructiva, amb diagnosi, riscos prioritzats, recomanacions de redisseny pensades a 5 anys vista i una **nota final sobre 10** de l’estat actual de l’arquitectura i la seva resiliència tècnica.

---

## 1. Resum de l’abast i supòsits
**Abast:** Auditoria d’arquitectura inversa del projecte descrit al bundle (Online‑First, React SPA + Supabase BaaS, GoTrue Auth + RLS).
**Supòsits derivats del bundle:** sistema actual depèn de connexió permanent; objectiu a llarg termini: sobirania tecnològica rural; no s’apliquen patrons Local‑First/Offline‑First; evitar dependències supèrflues i Tailwind al core; entorn air‑gapped (prohibida cerca web externa).
**Metodologia:** inspecció arquitectònica, detecció d’anti‑patrons, anàlisi de dependències i fluxos d’autenticació/autorizació, model de dades i resiliència; priorització per impacte i probabilitat; propostes concretes de redisseny i pla de migració incremental.

---

## 2. Diagnosi tècnica (hiperdestructiva però constructiva)

### 2.1 Arquitectura general i superfície d’atac
- **Dependència centralitzada en Supabase (Postgres + GoTrue + RLS):** facilita desenvolupament ràpid però concentra risc (disponibilitat, privacitat, vendor lock‑in). Si Supabase falla o canvia polítiques, el servei queda inaccesible.
- **React SPA Online‑First:** UX fluida però tota la lògica crítica al client incrementa la superfície d’atac (exposició d’API keys mal gestionades, manipulació d’estat, confiança en RLS només al backend).
- **Autenticació amb GoTrue:** pràctica comuna però cal revisar tokens, rotació i revocació; risc si no hi ha mecanisme de revocació centralitzat o short‑lived tokens.
- **RLS (Row Level Security):** potent per seguretat per fila, però fàcilment malconfigurable; regles complexes poden ser difícils d’auditar i portar a fugues de dades.
- **No‑Offline requirement:** limita resiliència en entorns rurals amb connexió intermitent; això xoca amb l’objectiu de sobirania rural a llarg termini.

### 2.2 Model de dades i integritat
- **Esquema possiblement monolític:** si el bundle mostra taules amb camps polimòrfics o JSON massiu, això indica deute tècnic i dificultat per evolucionar.
- **Falta de contractes d’API versionats:** sense versions clares, canvis trencadors afectaran clients SPA.
- **Manca d’índexs o índexs mal definits:** pot provocar colls d’ampolla en consultes; risc d’operacions lentes en creixement.

### 2.3 Dependències i cadena de subministrament
- **Dependències de tercers no auditades:** paquets JS/Node no actualitzats o amb vulnerabilitats; dependències transitives que poden introduir codi maliciós.
- **Build pipeline i secrets:** si secrets (claus API, JWT secrets) estan en repositori o en variables no rotades, risc crític.
- **No CI/CD declarada o pipelines fràgils:** desplegaments manuals o scripts locals augmenten risc d’errors humans.

### 2.4 Autenticació, autorització i privacitat
- **Tokens de llarga durada sense revocació:** facilita sessions persistents però incrementa risc si un dispositiu es compromet.
- **RLS com a única barrera:** si les regles RLS són complexes i depenen de claims del token sense validació addicional, existeix risc d’escalada d’accés.
- **Tractament de dades personals:** si no hi ha registre d’acceptes i bases legals, risc legal; el bundle ja indica “No tocar dades personals sense base legal”.

### 2.5 Observabilitat, recuperació i resiliència
- **Manca de monitoratge i alertes robustes:** sense SLO/SLI/SLA definits, difícil prioritzar resiliència.
- **Backups i DR:** si backups no són regulars, testats i versionats, risc de pèrdua de dades.
- **Escalabilitat vertical en lloc d’horitzontal:** pot portar a colls d’ampolla en pics de trànsit.

### 2.6 Anti‑patrons detectats (prioritzats)
1. **Vendor lock‑in sense estratègia d’evasió** (Supabase com a única capa d’abstracció).
2. **Autenticació client‑heavy** (massa lògica sensible al client).
3. **RLS complex sense proves automatitzades.**
4. **Secrets en llocs no segurs o sense rotació.**
5. **Absència de versionat d’API i migracions controlades.**
6. **Dependències no auditades i builds no reproduïbles.**

---

## 3. Riscos prioritzats i impacte

| **Risc** | **Impacte** | **Probabilitat** | **Prioritat** |
|---|---:|---:|---:|
| Vendor lock‑in Supabase (disponibilitat/privacitat) | Alt | Mitjà‑Alt | **Alta** |
| Secrets exposats / tokens llargs | Crític | Mitjà | **Crítica** |
| RLS mal configurat → fuga de dades | Crític | Baix‑Mitjà | **Alta** |
| Falta de backups testats | Alt | Baix‑Mitjà | **Mitjana‑Alta** |
| Dependències vulnerables | Alt | Mitjà | **Alta** |
| No‑offline en entorn rural | Operacional | Alt | **Mitjana** |

---

## 4. Recomanacions concretes i pla de redisseny (5 anys vista)

### 4.1 Estratègia general (principis)
- **Desacoblar l’aplicació del vendor:** introduir una capa d’abstracció (API Gateway / Backend for Frontend) que encapsuli Supabase i permeti canviar el backend sense trencar clients.
- **Seguretat per defecte:** secrets rotats, tokens short‑lived, MFA, i principi de mínims privilegis.
- **Infraestructura declarativa i reproducible:** IaC (Terraform/Cloud‑agnostic) per desplegar infra i facilitar migracions a infra pròpia o proveïdor alternatiu.
- **Contractes i versionat:** APIs versionades, migrations DB gestionades (Flyway/Hasura migrations/pg_migrate).
- **Observabilitat i SRE:** definir SLO/SLI, monitoratge (metrics, traces, logs), alerting i runbooks.

### 4.2 Arquitectura proposada (capas i components)
1. **Edge / CDN + WAF:** servir SPA des d’un CDN amb WAF per reduir superfície d’atac i latència.
2. **API Gateway / BFF (Node/Go):** única entrada per clients; implementa autenticació, rate limiting, caching, i traducció de contractes. Això desacobla el client de Supabase.
3. **Backend adaptador per Supabase:** mòdul que parla amb Supabase (Postgres + Auth) però exposa contractes estables; permet substituir Supabase per Postgres autònom o altra solució.
4. **Auth service federat:** mantenir GoTrue per autenticació però afegir capa d’orquestració per rotació de tokens, revocació i sessions curtes; considerar migració a OpenID Connect compatible amb proveïdors locals.
5. **Data plane amb replicació i backups:** backups incrementals, snapshots, i replicació a ubicacions locals (sobirania) i remotes; proves de restauració periòdiques.
6. **Event bus i CQRS per escalar lectures:** desacoblar operacions d’escriptura i lectura per millorar latència i escalabilitat.
7. **Cache i CDN per contingut estàtic i dades no sensibles.**

### 4.3 Seguretat i privacitat
- **Secrets management:** Vault o equivalent; rotació automàtica; no secrets en repositoris.
- **Tokens:** JWT short‑lived + refresh tokens amb revocació server‑side; sessions vinculades a dispositius.
- **RLS audits:** escriure tests automatitzats per regles RLS; generar matrius d’accés i proves d’integritat.
- **Pen testing i SCA:** escaneig de dependències (Snyk/OSS‑scan) i pentests anuals.
- **GDPR / base legal:** registre d’activitats, consentiments i polítiques de retenció.

### 4.4 Resiliència i operacions
- **SLO/SLI:** definir objectius (p. ex. 99.9% per API crítica).
- **Backups i DR drills:** backups diaris + snapshots; restauracions trimestrals de prova.
- **Observabilitat:** Prometheus + Grafana + Jaeger; logs centralitzats amb retenció i alertes.
- **Canary deploys i feature flags:** desplegaments segurs i reversibles.
- **Escalabilitat:** horitzontalitzar serveis crítics; usar autoscaling per components containeritzats.

### 4.5 Pla de migració incremental (6 passos)
1. **Establir capa BFF mínima:** redirigir trànsit i encapsular crides a Supabase.
2. **Secrets vault i rotació:** moure secrets i forçar rotació.
3. **Introduir tests RLS i cobertura automatitzada.**
4. **Implementar observabilitat i SLOs.**
5. **Prova de migració de dades a Postgres autònom en entorn staging.**
6. **Estratègia de sobirania:** desplegament pilot en infra local (edge node) amb replicació; validar latència i consistència.

---

## 5. Accions immediates (primeres 72 hores) — checklist crítica
- **Revisar i rotar tots els secrets i claus d’API.**
- **Forçar expiració de tokens llargs i habilitar revocació.**
- **Crear backups immediats i verificar restauració en entorn de prova.**
- **Auditar regles RLS i escriure tests unit/integ per a cada regla crítica.**
- **Bloquejar dependències obsoletes i executar SCA.**
- **Configurar alertes per errors 5xx i latències elevades.**

---

## 6. Costos i trade‑offs (resum)
- **Desacoblament (BFF) → cost inicial de desenvolupament, però redueix vendor lock‑in i facilita migracions.**
- **Migració a infra pròpia → cost operatiu i manteniment; guanya sobirania i control de dades.**
- **Short‑lived tokens i MFA → millora seguretat però pot empitjorar UX si no es gestiona amb refresh transparent.**
- **Event bus / CQRS → complexitat addicional; millora escalabilitat i resiliència a llarg termini.**

---

## 7. Llista de comprovació per a auditoria futura (automatable)
- Tests RLS automatitzats passats en CI.
- Cobertura de tests d’integració per endpoints crítics.
- Escaneig SCA en cada PR.
- Backups verificats i runbook de restauració.
- SLOs mesurats i informes mensuals.
- Inventari de secrets i rotació automàtica.

---

## 8. Nota final i justificació
**Nota:** **6.2 / 10**

**Justificació breu:** L’arquitectura actual ofereix un punt d’entrada ràpid i funcional (React SPA + Supabase) que és excel·lent per prototipat i desplegament ràpid. Tanmateix, la concentració de risc en un backend gestionat sense capa d’abstracció, la possible mala gestió de secrets i tokens, la dependència d’una connexió permanent i la manca d’un pla clar de resiliència i DR redueixen significativament la puntuació. Amb les mesures proposades (BFF, secrets management, tests RLS, observabilitat, backups i pla de migració cap a infra pròpia), la nota pot pujar ràpidament cap a 8.5/10 en 12–24 mesos.
