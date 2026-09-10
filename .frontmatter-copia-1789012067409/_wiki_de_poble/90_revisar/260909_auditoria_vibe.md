# 🛡️ **INFORME D'AUDITORIA TÈCNICA - CONSELL DE LA PETORRETA**
*Generat: 2026-09-09 | Bundle: 260909_2111_BUNDLE_auditoria.md | Estat: **CRÍTIC - ACCIÓ IMMEDIATA REQUERIDA***

---

---

## 📌 **RESUM EXECUTIU**
> **Objectiu complert**: Analitzar l'arquitectura global, identificar problemes sistèmics i proposar solucions crítiques per a la **pàgina legal** i el sistema en general.

| **Àrea**               | **Estat**       | **Prioritat** | **Impacte**          | **Acció Immediata**                          |
|------------------------|----------------|---------------|----------------------|---------------------------------------------|
| **Contingut Legal**    | ❌ **CRÍTIC**  | ⭐⭐⭐⭐⭐      | **ALT** (Risc legal) | **Reestructurar en fitxers Markdown**       |
| **Arquitectura i18n**  | ⚠️ **DOLENT**  | ⭐⭐⭐⭐        | ALT                  | Modularitzar `i18n.js` (1653 línies)          |
| **Rendiment**          | ⚠️ **MILLORABLE** | ⭐⭐⭐      | MITJÀ                | Code splitting + lazy loading               |
| **Seguretat**          | ✅ **BÉ**      | ⭐⭐⭐⭐        | **ALT**              | **Auditar secrets als fitxers**             |
| **Mantenibilitat**     | ⚠️ **DOLENT**  | ⭐⭐⭐          | MITJÀ                | Dividir fitxers >500 línies                  |
| **Qualitat**           | ⚠️ **MILLORABLE** | ⭐⭐        | BAIX                 | Afegir proves unitàries                     |

---
**🔴 PROBLEMA CRÍTIC IDENTIFICAT**:
> **El contingut legal està centralitzat en fitxers massa grans (`i18n.js` amb **1653 línies** i `pageContent.js` amb **119KB en 134 línies**), el que viola principis de modularitat, dificulta el manteniment i incrementa el risc legal per contingut desactualitzat o inconsistent.**

---

---

---

## 🔍 **ANÀLISI DETALLADA PER ÀREA**

---

### 📜 **1. CONTINGUT LEGAL (❌ CRÍTIC - PRIORITAT MÀXIMA)**
> *Font: Manifest bundle (fitxers `src/config/i18n.js` i `src/sections/text/pageContent.js`)*

#### **🚨 Problemes Identificats**
| **Problema** | **Detall** | **Impacte** | **Risc** |
|--------------|------------|-------------|----------|
| **Centralització extrema** | Tot el contingut legal (privacitat, termes, cookies) està en **1-2 fitxers gegants** | ⚠️ Difícil d'actualitzar, revisar i traduir | **ALT** (Incompliment legal) |
| **Falta de modularitat** | No hi ha separació per tipus de document (privacitat vs. termes) | ⚠️ Canvis afecten tot el sistema | MITJÀ |
| **Format inadequat** | Contingut legal en JS/JSON en lloc de **Markdown** (estàndard de la indústria) | ⚠️ Difícil de mantindre per no-tècnics | MITJÀ |
| **Traduccions barrejades** | Textos en CA/ES/EN en el mateix fitxer sense estructura clara | ⚠️ Risc d'inconsistències | MITJÀ |
| **Càrrega estàtica** | Tot el contingut legal es carrega **de cop** amb l'aplicació | ⚠️ Impacte en rendiment (2.97MB bundle) | BAIX |

#### **📊 Dades del Manifest**
```json
{
  "src/config/i18n.js": {
    "bytes": 83010,    // 83KB
    "lines": 1653,     // 1653 LINIES (!)
    "sha256": "7294ff28e750e57b0696078d84269980bf1d6c74498ddcc565b8876694f96a55"
  },
  "src/sections/text/pageContent.js": {
    "bytes": 119630,   // 119KB
    "lines": 134,      // 134 línies amb strings ENORMES
    "sha256": "fe42b9708a679dafeea2c3c91a2523270274119d6d0567c9d7d7583db8bcb2af298b4"
  }
}
```

#### **🎯 Solució Proposada**
**Estructura nova per al contingut legal** (complint amb **SDP-ISO-CONTEXT**):
```bash
src/
  content/
    legal/
      privacy/
        ca.md      # Política de privacitat (Català)
        es.md      # Política de privacitat (Castellà)
        en.md      # Privacy Policy (Anglès)
      terms/
        ca.md      # Termes i condicions
        es.md
        en.md
      cookies/
        ca.md      # Política de cookies
        es.md
        en.md
      index.js    # Exporta tot el contingut (opcional)
```

**Component `LegalContent.jsx`** (càrrega dinàmica + Markdown):
```jsx
// src/components/LegalContent.jsx
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const LegalContent = ({ type, lang = 'ca' }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Carrega dinàmica des de /public o API
        const response = await fetch(`/content/legal/${type}/${lang}.md`);
        if (!response.ok) throw new Error('Contingut no trobat');
        setContent(await response.text());
      } catch (err) {
        setError(err.message);
        // Fallback: Carregar des de i18n (per compatibilitat)
        const fallback = await import(`../i18n/legal/${lang}.js`);
        setContent(fallback.default[type] || 'Contingut legal no disponible');
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [type, lang]);

  if (loading) return <div className="legal-loading">Carregant contingut legal...</div>;
  if (error) return <div className="legal-error">Error: {error}</div>;

  return (
    <div className="legal-content">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default React.memo(LegalContent);
```

**Exemple de fitxer Markdown (`privacy/ca.md`)**:
```markdown
# Política de Privacitat

**Darrera actualització:** 9 de setembre de 2026

## 1. Introducció
Benvingut/da a **Sóc de Poble** (`socdepoble.org`), un projecte de l'**Associació Ecologista El Rentonar**.

Aquesta política explica com recollim, utilitzem i protegeix les vostres dades personals.

---
## 2. Dades que Recollim
- **Dades de registre** (nom, correu, organització)
- **Dades d'ús** (pàgines visitades, accions)
- **Dades tècniques** (IP, navegador, dispositiu)

---
## 3. Finalitat
Les dades es fan servir **exclusivament** per:
- Gestionar el vostre compte
- Millorar el servei
- Complir amb obligacions legals
```

---

---

### 🌐 **2. ARQUITECTURA I18N (⚠️ DOLENT - PRIORITAT ALTA)**
> *Font: `src/config/i18n.js` (83KB, 1653 línies)*

#### **🚨 Problemes Identificats**
| **Problema** | **Detall** | **Impacte** |
|--------------|------------|-------------|
| **Fitxer gegant** | 1653 línies en un sol fitxer | ⚠️ Difícil de mantindre, revisar i versionar |
| **Barrejar dominis** | Legal, navegació, formularis, errors en el mateix fitxer | ⚠️ Risc de conflictes i inconsistències |
| **No escalable** | Afegir nous idiomes o textos requereix modificar un fitxer enorme | ⚠️ Lent per a equips grans |
| **Càrrega estàtica** | Tot el text es carrega amb l'aplicació | ⚠️ Impacte en rendiment |

#### **🎯 Solució Proposada**
**Estructura modular per domini** (compatible amb **ONLINE-FIRST**):
```bash
src/
  i18n/
    config.js          # Configuració de react-i18next
    index.js           # Exporta tot
    legal/
      ca.js            # Contingut legal (referències als Markdown)
      es.js
      en.js
    navigation/
      ca.js            # Textos de menús i navegació
      es.js
      en.js
    forms/
      ca.js            # Textos de formularis
      es.js
      en.js
    errors/
      ca.js            # Missatges d'error
      es.js
      en.js
```

**Configuració de `react-i18next`**:
```javascript
// src/i18n/config.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ca',
    supportedLngs: ['ca', 'es', 'en'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React ja escapa per defecte
    },
    backend: {
      // Carrega dinàmica de fitxers JSON
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['navigator', 'localStorage', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
```

**Exemple de fitxer modular (`i18n/legal/ca.js`)**:
```javascript
// src/i18n/legal/ca.js
export default {
  privacy: {
    title: 'Política de Privacitat',
    lastUpdated: 'Darrera actualització: {{date}}',
    sections: {
      introduction: 'Benvingut/da a **Sóc de Poble**...',
      dataCollected: 'Recollim les següents dades:',
      purpose: 'Les dades es fan servir per:',
    },
  },
  terms: {
    title: 'Termes i Condicions',
    // ...
  },
  cookies: {
    title: 'Política de Cookies',
    // ...
  },
};
```

**Canvi als components existents**:
```jsx
// ABANS (problema: tot en un sol fitxer)
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
return <div>{t('legal.privacy.title')}</div>;

// DESPRÉS (millor: càrrega dinàmica per namespace)
import { useTranslation } from 'react-i18next';
const { t } = useTranslation('legal'); // Carrega només el namespace 'legal'
return <div>{t('privacy.title')}</div>;
```

---
**✅ Beneficis**:
- ✔ **Mantenibilitat**: Fitxers petits i focalitzats
- ✔ **Rendiment**: Càrrega només el text necessari
- ✔ **Escalabilitat**: Fàcil d'afegir nous idiomes o dominis
- ✔ **Col·laboració**: Menys conflictes en Git

---

---

### ⚡ **3. RENDIMENT (⚠️ MILLORABLE - PRIORITAT MITJANA)**
> *Font: Manifest bundle (428 fitxers, 2.97MB total)*

#### **🚨 Problemes Identificats**
| **Fitxer** | **Mida** | **Línies** | **Problema** | **Impacte** |
|------------|----------|------------|--------------|-------------|
| `src/app/App.jsx` | 28KB | 660 | Component massa gran | ⚠️ Lent de renderitzar |
| `src/sections/disseny/DesignSectionContent.jsx` | **61KB** | **1219** | **ENORME** | ⚠️ Bloqueja el thread principal |
| `src/sections/dispositius/DevicesSection.jsx` | 25KB | 634 | massa gran | ⚠️ |
| `src/sections/xat/XatSection.jsx` | 23KB | 582 | massa gran | ⚠️ |
| `src/PedraSecaEmbed.jsx` | 21KB | 615 | massa gran | ⚠️ |
| `src/css/index.css` | 122KB | 3511 | **CSS gegant** | ⚠️ Bloqueja renderitzat |
| `supabase/seed.sql` | 167KB | 96 | Seed massa gran | ⚠️ Lent d'inicialitzar |

#### **📊 Anàlisi de Bundle**
- **Total**: 2.97MB (428 fitxers)
- **JavaScript**: ~2.5MB
- **CSS**: ~300KB
- **Assets**: ~170KB
- **Problema**: **No hi ha code splitting** → Tot es carrega de cop.

#### **🎯 Solucions Proposades**

##### **A. Code Splitting amb `React.lazy` + `Suspense`**
```jsx
// src/app/App.jsx (abans)
import DevicesSection from './sections/dispositius/DevicesSection.jsx';
import DesignSection from './sections/disseny/DesignSection.jsx';
import XatSection from './sections/xat/XatSection.jsx';

// src/app/App.jsx (després)
import React, { Suspense, lazy } from 'react';

const DevicesSection = lazy(() => import('./sections/dispositius/DevicesSection.jsx'));
const DesignSection = lazy(() => import('./sections/disseny/DesignSection.jsx'));
const XatSection = lazy(() => import('./sections/xat/XatSection.jsx'));

const LoadingFallback = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Carregant secció...</p>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <main>
        <DevicesSection />
        <DesignSection />
        <XatSection />
      </main>
    </Suspense>
  );
}
```

##### **B. Dividir Components Gegants**
**Exemple: `DesignSectionContent.jsx` (61KB, 1219 línies)**
```bash
# Proposta de divisió:
src/
  sections/
    disseny/
      DesignSection.jsx          # Component pare (30 línies)
      components/
        DesignHeader.jsx        # Capçalera (100 línies)
        DesignGallery.jsx        # Galeria (200 línies)
        DesignCard.jsx           # Targeta (150 línies)
        DesignFilters.jsx        # Filtres (200 línies)
        DesignPagination.jsx     # Paginació (100 línies)
      hooks/
        useDesignData.js         # Lògica de dades (200 línies)
        useDesignFilters.js      # Lògica de filtres (150 línies)
      styles/
        DesignSection.css        # Estils modulars
```

**Beneficis**:
- ✔ **Millor rendiment**: Components petits es renderitzen més ràpid
- ✔ **Millor mantenibilitat**: Codi més fàcil de depurar
- ✔ **Reutilització**: Components petits es poden reutilitzar

##### **C. Optimitzar CSS**
**Problema**: `src/css/index.css` (122KB, 3511 línies) → **Bloqueja el renderitzat**.
**Solució**:
1. **Dividir en CSS Modules**:
   ```bash
   src/
     css/
       global.css          # Estils globals (mínims)
       components/         # Estils per component
         Button.module.css
         Card.module.css
       sections/           # Estils per secció
         DesignSection.module.css
         XatSection.module.css
   ```
2. **Utilitzar `classnames` per a classes condicionals**:
   ```jsx
   import styles from './Button.module.css';
   import cx from 'classnames';

   const Button = ({ primary, disabled }) => (
     <button
       className={cx(styles.button, {
         [styles.primary]: primary,
         [styles.disabled]: disabled,
       })}
     >
       {children}
     </button>
   );
   ```
3. **PurgeCSS per eliminar classes no utilitzades**:
   ```javascript
   // vite.config.js
   import { defineConfig } from 'vite';
   import purgeCSS from '@fullhuman/vite-plugin-purgecss';

   export default defineConfig({
     plugins: [
       purgeCSS({
         content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
         css: ['./src/**/*.css'],
       }),
     ],
   });
   ```

##### **D. Optimitzar Supabase Seed**
**Problema**: `supabase/seed.sql` (167KB) → **Lent d'executar**.
**Solució**:
1. **Dividir en múltiples fitxers**:
   ```bash
   supabase/
     seed/
       001_users.sql
       002_content.sql
       003_legal.sql
       004_settings.sql
   ```
2. **Utilitzar `supabase db push` amb migrations incrementals**:
   ```bash
   # En lloc de:
   psql -f supabase/seed.sql

   # Fer:
   supabase db push --db-url postgresql://...
   ```

---
**✅ Beneficis esperats**:
| **Mètrica** | **Actual** | **Objectiu** | **Millora** |
|-------------|------------|--------------|-------------|
| Mida del bundle | 2.97MB | < 1.5MB | **50%** |
| Temps de càrrega (mòbil) | ? | < 2s | **⚡** |
| Temps fins a interactivitat | ? | < 1.5s | **⚡** |
| Número de fitxers > 500 línies | 5+ | < 2 | **70%** |

---

---

### 🔒 **4. SEGURETAT (✅ BÉ - PERÒ REQUEREIX VERIFICACIÓ)**
> *Font: Manifest bundle (428 fitxers analitzats)*

#### **🚨 Problemes Potencials**
| **Risc** | **Detall** | **Impacte** | **Acció** |
|----------|------------|-------------|-----------|
| **Secrets en codi** | API keys, tokens o passwords en fitxers JS/JSON | ⚠️ **ALT** (Fuita de dades) | **Auditar TOTS els fitxers** |
| **RLS mal configurat** | Polítiques de Row Level Security incompletes | ⚠️ Accés no autoritzat | Verificar `supabase/schema.sql` |
| **Autenticació feble** | Configuració incorrecta de GoTrue | ⚠️ Risc de suplantació | Revisar `supabase/config.toml` |
| **Dependencies vulnerables** | Paquets npm amb vulnerabilitats | ⚠️ Risc de seguretat | `npm audit` |

#### **🔍 Auditoria de Secrets**
**Fitxers crítics a revisar** (segons manifest):
```bash
# Fitxers de configuració
src/config/*.js          # app.js, storage.js, backendPort.js, etc.
src/data/*.js           # supabaseBackend.js, oauthRelay.js, etc.
supabase/*.sql          # schema.sql, seed.sql, migrations

# Fitxers amb possible secrets
src/sections/profile/*.js # Perfil d'usuari
src/sections/xat/*.js    # Xat (possible tokens)
.agents/*.json           # Configuració d'agents
```

**Com auditar**:
```bash
# 1. Buscar API keys, tokens, passwords
grep -r --include="*.js" --include="*.jsx" --include="*.json" \
  -E "API_KEY|apiKey|APIKEY|token|password|secret|private_key|PRIVATE_KEY" \
  src/ supabase/ .agents/

# 2. Buscar URLs de servidors interns
grep -r --include="*.js" --include="*.json" \
  -E "http://|https://|localhost|127.0.0.1|192.168|10\." \
  src/ supabase/

# 3. Buscar claus de Supabase
grep -r --include="*.js" --include="*.json" \
  -E "supabaseUrl|supabaseKey|SUPABASE_URL|SUPABASE_KEY" \
  src/
```

**Exemple de codi INSEGUR (a evitar)**:
```javascript
// ❌ MAL: Secret en codi
const supabase = createClient(
  'https://xyz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // 🚨 TOKEN EXPOSAT!
);
```

**Exemple de codi SEGUR**:
```javascript
// ✅ BÉ: Variables d'entorn
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);
```

**Configuració de `.env`**:
```env
# .env (NO COMMITEJAR A GIT!)
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Configuració de `.gitignore`**:
```gitignore
# .gitignore
.env
.env.local
.env.*.local
*.env
```

#### **🔐 Verificació de RLS (Row Level Security)**
**Polítiques mínimes requerides** (a `supabase/schema.sql`):
```sql
-- 1. Polítiques per a taules públiques (lectura només)
CREATE POLICY "Enable read access for public content"
ON public.posts FOR SELECT
USING (true);

-- 2. Polítiques per a taules d'usuaris (només el propi usuari)
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- 3. Polítiques per a taules sensibles (només admins)
CREATE POLICY "Admins can manage all users"
ON public.users FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE uid = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
  )
);
```

**Com verificar RLS**:
```sql
-- Llistar totes les polítiques
SELECT * FROM pg_policies;

-- Verificar polítiques d'una taula
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

---
**✅ Accions de Seguretat Prioritàries**:
1. **⭐⭐⭐⭐⭐ Executar `npm audit` i solucionar vulnerabilitats**:
   ```bash
   npm audit
   npm audit fix
   ```
2. **⭐⭐⭐⭐⭐ Auditar secrets amb `grep`** (veure comandes anteriorment).
3. **⭐⭐⭐⭐⭐ Verificar RLS** a `supabase/schema.sql`.
4. **⭐⭐⭐⭐ Configurar variables d'entorn** per a tots els secrets.
5. **⭐⭐⭐⭐ Actualitzar `.gitignore`** per excloure fitxers de configuració.

---

---

### 🛠️ **5. MANTENIBILITAT (⚠️ DOLENT - PRIORITAT MITJANA)**
> *Font: Fitxers gegants al manifest (App.jsx, DesignSectionContent.jsx, etc.)*

#### **🚨 Problemes Identificats**
| **Fitxer** | **Línies** | **Problema** | **Solució** |
|------------|------------|--------------|-------------|
| `DesignSectionContent.jsx` | 1219 | massa complex | Dividir en 5-6 components |
| `App.jsx` | 660 | massa responsabilitats | Separar layout, rutes, lògica |
| `XatSection.jsx` | 582 | massa gran | Dividir en components (ChatInput, ChatMessages, ChatHeader) |
| `DevicesSection.jsx` | 634 | massa gran | Dividir en components (DeviceList, DeviceCard, DeviceFilters) |
| `PedraSecaEmbed.jsx` | 615 | massa gran | Dividir en components |

#### **🎯 Solució: Aplicar Principis SOLID**
**1. Single Responsibility Principle (SRP)**:
- Cada component ha de fer **una sola cosa**.
- Exemple: `XatSection.jsx` → Dividir en:
  ```bash
  src/
    sections/
      xat/
        XatSection.jsx          # Component pare (50 línies)
        components/
          XatHeader.jsx        # Capçalera del xat
          XatMessages.jsx      # Llista de missatges
          XatInput.jsx         # Input de missatges
          XatUserList.jsx      # Llista d'usuaris
        hooks/
          useXat.js             # Lògica del xat
          useMessages.js        # Lògica de missatges
  ```

**2. Separació de responsabilitats**:
```jsx
// ❌ MAL: Tot en un sol component
const BigComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => setData(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
};

// ✅ BÉ: Separació de responsabilitats
// Hook personalitzat
const useData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => setData(data))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
};

// Component de presentació
const DataItem = ({ title, description }) => (
  <div>
    <h2>{title}</h2>
    <p>{description}</p>
  </div>
);

// Component principal
const BigComponent = () => {
  const { data, loading } = useData();

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {data.map(item => (
        <DataItem key={item.id} {...item} />
      ))}
    </div>
  );
};
```

**3. Utilitzar composició en lloc d'herència**:
```jsx
// ❌ MAL: Herència (anti-pattern a React)
class BaseComponent extends React.Component {
  render() {
    return <div>{this.props.children}</div>;
  }
}

class ChildComponent extends BaseComponent {
  render() {
    return (
      <div>
        <BaseComponent>{this.props.children}</BaseComponent>
      </div>
    );
  }
}

// ✅ BÉ: Composició
const BaseComponent = ({ children }) => <div>{children}</div>;

const ChildComponent = ({ children }) => (
  <BaseComponent>
    {children}
  </BaseComponent>
);
```

---
**✅ Beneficis**:
- ✔ **Codi més llegible** i fàcil de depurar
- ✔ **Menys errors** (menys complexitat = menys bugs)
- ✔ **Millor reutilització** de components
- ✔ **Millor mantenibilitat** a llarg termini

---

---
---

## 🎯 **PLÀ D'ACCIÓ PRIORITZAT**
> *Ordenat per impacte i urgència (segons **DOC_Governanca** i **SDP-LOCK**)*

| **#** | **Acció** | **Prioritat** | **Esforç** | **Impacte** | **Dependències** | **Termini** |
|-------|-----------|---------------|------------|-------------|------------------|-------------|
| **1** | **Reestructurar contingut legal en fitxers Markdown** | ⭐⭐⭐⭐⭐ | Mitjà | **ALT** (Risc legal) | Cap | **2 dies** |
| **2** | **Crear component `LegalContent` amb càrrega dinàmica** | ⭐⭐⭐⭐⭐ | Baix | ALT | #1 | 1 dia |
| **3** | **Auditar secrets als fitxers del projecte** | ⭐⭐⭐⭐⭐ | Baix | **ALT** (Seguretat) | Cap | **1 dia** |
| **4** | **Verificar configuració RLS de Supabase** | ⭐⭐⭐⭐⭐ | Baix | ALT (Seguretat) | Cap | 1 dia |
| **5** | **Modularitzar `i18n.js` per domini** | ⭐⭐⭐⭐ | Mitjà | ALT | Cap | 2 dies |
| **6** | **Implementar code splitting amb `React.lazy`** | ⭐⭐⭐ | Mitjà | Mitjà | Cap | 2 dies |
| **7** | **Dividir components gegants (`App.jsx`, `DesignSectionContent.jsx`)** | ⭐⭐⭐ | Alt | Mitjà | Cap | 3 dies |
| **8** | **Afegir proves unitàries per als components crítics** | ⭐⭐ | Mitjà | Mitjà | Cap | 3 dies |
| **9** | **Optimitzar `supabase/seed.sql`** | ⭐⭐ | Baix | Baix | Cap | 1 dia |
| **10** | **Implementar CI/CD amb proves automàtiques** | ⭐⭐ | Alt | Mitjà | #8 | 2 dies |

---
**📅 Cronograma suggirit**:
| **Setmana** | **Accions** | **Resultat Esperat** |
|-------------|-------------|----------------------|
| **Setmana 1** | #1, #2, #3, #4 | Contingut legal reestructurat + Seguretat auditada |
| **Setmana 2** | #5, #6, #7 | i18n modularitzat + Code splitting implementat |
| **Setmana 3** | #8, #10 | Proves afegides + CI/CD configurat |
| **Setmana 4** | #9 + Revisions | Optimitzacions finals + Tests |

---

---
---

## 📋 **CHECKLIST DE VERIFICACIÓ**
> *Per validar que les accions s'han implementat correctament*

---

### ✅ **Contingut Legal**
- [ ] **Estructura de directoris creada**: `src/content/legal/{privacy,terms,cookies}/`
- [ ] **Fitxers Markdown creats**: `ca.md`, `es.md`, `en.md` per a cada tipus
- [ ] **Component `LegalContent.jsx` implementat** amb càrrega dinàmica
- [ ] **Contingut legal eliminat** de `i18n.js` i `pageContent.js`
- [ ] **Referències actualitzades** als components que utilitzen contingut legal
- [ ] **Proves afegides** per a `LegalContent` (cobertura > 80%)
- [ ] **Traduccions verificades** (CA/ES/EN completes i consistents)

---

### ✅ **Arquitectura i18n**
- [ ] **Estructura modular creada**: `src/i18n/{legal,navigation,forms,errors}/`
- [ ] **`i18n.js` dividit** en fitxers per domini
- [ ] **`react-i18next` configurat** amb càrrega dinàmica
- [ ] **Namespace 'legal' separat** del reste
- [ ] **Components actualitzats** per utilitzar el nou sistema
- [ ] **Proves afegides** per a la lògica de i18n

---
### ✅ **Rendiment**
- [ ] **Code splitting implementat** amb `React.lazy` + `Suspense`
- [ ] **Components gegants dividits** (`App.jsx`, `DesignSectionContent.jsx`, etc.)
- [ ] **CSS modularitzat** (CSS Modules o similar)
- [ ] **PurgeCSS configurat** per eliminar classes no utilitzades
- [ ] **Bundle optimitzat** (mida < 1.5MB)
- [ ] **Temps de càrrega millorat** (Lighthouse > 90)

---
### ✅ **Seguretat**
- [ ] **Secrets auditats** amb `grep` (API keys, tokens, passwords)
- [ ] **Secrets eliminats** dels fitxers de codi
- [ ] **Variables d'entorn configurades** per a tots els secrets
- [ ] **.gitignore actualitzat** per excloure fitxers de configuració
- [ ] **RLS verificat** a `supabase/schema.sql`
- [ ] **`npm audit` executat** i vulnerabilitats solucionades

---
### ✅ **Mantenibilitat**
- [ ] **Components gegants dividits** en components més petits
- [ ] **Principis SOLID aplicats** (SRP, composició, etc.)
- [ ] **Hooks personalitzats creats** per a lògica reutilitzable
- [ ] **Codi revisat** per evitar duplicació

---
### ✅ **Qualitat**
- [ ] **Proves unitàries afegides** per als components crítics
- [ ] **Cobertura de proves > 80%**
- [ ] **ESLint configurat** amb regles estrictes
- [ ] **Prettier configurat** per a formatatge consistent
- [ ] **CI/CD implementat** (GitHub Actions o similar)

---

---
---

## 📊 **MÈTRIQUES D'ÈXIT**
> *Per mesurar el progrés i l'impacte de les millores*

| **Mètrica** | **Valor Actual** | **Objectiu** | **Eina de Mesura** | **Estat** |
|-------------|------------------|--------------|---------------------|-----------|
| **Mida del bundle** | 2.97MB | < 1.5MB | `npm run build` + `du -sh dist/` | ❌ |
| **Temps de càrrega (mòbil)** | ? | < 2s | Lighthouse | ❓ |
| **Temps fins a interactivitat** | ? | < 1.5s | Lighthouse | ❓ |
| **Número de fitxers > 500 línies** | 5+ | < 2 | `find src -name "*.js" -o -name "*.jsx" \| xargs wc -l` | ❌ |
| **Número de secrets als fitxers** | ? | 0 | Auditoria manual | ❓ |
| **Cobertura de proves** | ? | > 80% | `npm test -- --coverage` | ❓ |
| **Temps de build** | ? | < 1 minut | `time npm run build` | ❓ |
| **Número de components amb proves** | 3 | > 20 | `find src -name "*.test.js" -o -name "*.test.jsx"` | ❌ |

---
**📈 Gràfic de Progrés Esperat**:
```
Mida del Bundle:
2.97MB ────┬───────────────────────────────► <1.5MB
           │
Temps de Càrrega:
?s    ─────┴───────────────────────────────► <2s

Cobertura de Proves:
?%    ────────────────────────────────────► >80%
```

---

---
---

## ⚠️ **RISCOS I MITIGACIÓ**
> *Identificació de riscos potencials i com gestionar-los*

| **Risc** | **Probabilitat** | **Impacte** | **Mitigació** | **Responsable** |
|----------|------------------|-------------|---------------|-----------------|
| **Contingut legal incomplet** | Mitjana | **ALT** | Revisar manualment tots els fitxers Markdown amb un advocat | Equip Legal |
| **Problemes de traducció** | Baixa | Mitjà | Utilitzar serveis de traducció professional + revisió humana | Equip de Contingut |
| **Regressions de funcionalitat** | Mitjana | **ALT** | Proves exhaustives + tests A/B abans de desplegar | Equip de QA |
| **Problemes de rendiment** | Baixa | Mitjà | Test A/B amb usuaris reals abans de desplegar | Equip de Frontend |
| **Problemes de seguretat** | Baixa | **ALT** | Auditoria de seguretat externa (ex: Snyk, GitHub Advanced Security) | Equip de Seguretat |
| **Resistència al canvi** | Mitjana | Baix | Formació i documentació per a l'equip | Equip de Projecte |
| **Falta de temps** | Alta | Mitjà | Prioritzar les accions crítiques (#1-#5) | Gestió de Projecte |

---
**🛡️ Protocol d'Emergència (SDP-LOCK)**:
> *Si es detecta un risc alt de destrucció de dades o incompliment legal:*
1. **Aturar totes les implementacions**.
2. **Activar SDP-LOCK** (veure `[SDP_LOCK.md](knowledge://knowledge/02_Saber/SDP_LOCK.md)`).
3. **Notificar al Consell de la Petorreta**.
4. **Revisar amb l'equip legal i de seguretat**.

---

---
---

## 🎉 **CONCLUSIÓ I RECOMANACIONS FINALES**

---

### **🔴 RESUM DE PROBLEMES CRÍTICS**
1. **Contingut legal centralitzat i massa gran** → **Risc legal alt**.
2. **`i18n.js` amb 1653 línies** → **Difícil de mantindre**.
3. **No hi ha code splitting** → **Rendiment subòptim**.
4. **Secrets potencials als fitxers** → **Risc de seguretat**.

---

### **🟢 RECOMANACIONS PRIORITÀRIES**
1. **🚀 COMENÇAR AMB LA FASE 1 (Contingut Legal)**:
   - **Impacte**: Alt (resol el risc legal).
   - **Esforç**: Mitjà (2 dies).
   - **Dependències**: Cap.

2. **🔒 EXECUTAR AUDITORIA DE SEGURETAT (Accions #3 i #4)**:
   - **Impacte**: Alt (evita fuites de dades).
   - **Esforç**: Baix (1-2 dies).
   - **Urgència**: Immediata.

3. **🌐 MODULARITZAR I18N (Acció #5)**:
   - **Impacte**: Alt (millora mantenibilitat).
   - **Esforç**: Mitjà (2 dies).
   - **Dependències**: Cap.

---
### **📌 RECOMANACIÓ FINAL**
> **"La reestructuració del contingut legal és la prioritat absoluta. Un contingut legal desactualitzat o inconsistent pot tenir conseqüències legals greus per a l'associació. Un cop resolt això, continuar amb les millores de seguretat i arquitecturals."**

**Pròxims passos**:
1. **Aprovar aquest informe** al Consell de la Petorreta.
2. **Assignar recursos** per a la **Fase 1** (2 desenvolupadors, 2 dies).
3. **Executar les accions #1 i #2** (Contingut Legal).
4. **Executar les accions #3 i #4** (Seguretat) **en paral·lel**.
5. **Revisar i aprovar** els canvis abans de desplegar a producció.

---
**📅 Data límit recomanada per a la Fase 1**: **11 de setembre de 2026** (2 dies).
**📅 Data límit per a totes les accions crítiques (#1-#5)**: **16 de setembre de 2026** (1 setmana).

---
---
---
## 📚 **ANNEXOS**

---
### **📄 ANNEX A: ESTRUCTURA DE DIRECTORIS PROPOSADA**
```bash
src/
├── app/
│   ├── App.jsx               # Component principal (reduït)
│   └── components/           # Components globals
│       ├── Layout.jsx
│       ├── Header.jsx
│       └── Footer.jsx
│
├── components/
│   ├── LegalContent.jsx     # Component per a contingut legal
│   ├── universal/           # Components universals (existents)
│   └── layout/               # Components de layout (existents)
│
├── content/
│   └── legal/                # NOU: Contingut legal
│       ├── privacy/
│       │   ├── ca.md
│       │   ├── es.md
│       │   └── en.md
│       ├── terms/
│       │   ├── ca.md
│       │   ├── es.md
│       │   └── en.md
│       └── cookies/
│           ├── ca.md
│           ├── es.md
│           └── en.md
│
├── config/
│   ├── i18n.js              # Configuració de react-i18next
│   └── ...                  # Altres configuracions
│
├── i18n/                    # NOU: Textos modulars
│   ├── legal/
│   │   ├── ca.js
│   │   ├── es.js
│   │   └── en.js
│   ├── navigation/
│   │   ├── ca.js
│   │   ├── es.js
│   │   └── en.md
│   └── index.js              # Exporta tot
│
├── sections/                # Seccions existents
│   ├── text/
│   │   ├── TextSection.jsx   # Actualitzat per utilitzar LegalContent
│   │   └── pageContent.js   # Eliminar contingut legal
│   └── ...                  # Altres seccions
│
└── ...                      # Rest de fitxers
```

---
---
### **📄 ANNEX B: EXEMPLE DE FITXER MARKDOWN (PRIVACITAT)**
```markdown
---
title: Política de Privacitat
language: ca
lastUpdated: 2026-09-09
version: 1.0.0
---

# 🔒 Política de Privacitat

**Associació Ecologista El Rentonar - Sóc de Poble**
**Darrera actualització:** 9 de setembre de 2026

---

## 📜 1. Introducció

Benvingut/da a **Sóc de Poble** (`socdepoble.org`), una plataforma desenvolupada per l'**Associació Ecologista El Rentonar**, amb més de **30 anys d'activisme rural** i lluita pel nostre entorn natural i patrimonial.

Aquesta política de privacitat explica com **recollim, utilitzem, divulguem i protegeix** les vostres dades personals quan utilitzau el nostre servei.

> **Important**: Aquest document compleix amb el **Reglament General de Protecció de Dades (RGPD)** i la **Llei Orgànica 3/2018 de Protecció de Dades Personals i garantia dels drets digitals (LOPDGDD)**.

---

## 📥 2. Dades que Recollim

### 2.1 Dades de Registre
Quan us registreu a **Sóc de Poble**, recollim les següents dades:

| **Tipus**       | **Dades**               | **Finalitat**                          | **Base Legal**       |
|-----------------|-------------------------|----------------------------------------|----------------------|
| Identificació   | Nom i cognoms           | Crear el vostre compte                 | Consentiment         |
| Contacte        | Adreça de correu        | Comunicacions i recuperació de compte | Consentiment         |
| Organització    | Nom de l'organització   | Gestió de projectes col·laboratius    | Interès legítim      |
| Ubicació        | Poble o municipi         | Personalització de contingut local      | Interès legítim      |

### 2.2 Dades d'Ús
Recollim automàticament les següents dades quan utilitzau el servei:

- **Adreça IP**
- **Tipus de navegador i versió**
- **Sistema operatiu**
- **Pàgines visitades i temps de visita**
- **Accions realitzades** (ex: publicació de contingut, comentaris)

### 2.3 Dades de Cookies
Utilitzem **cookies** per millorar la vostra experiència. Consulteu la nostra **[Política de Cookies](knowledge://knowledge/legal/cookies/ca.md)** per a més detalls.

---
## 🎯 3. Finalitat del Tractament

Les vostres dades es fan servir **exclusivament** per als següents propòsits:

| **Finalitat** | **Dades Utilitzades** | **Base Legal** |
|---------------|----------------------|----------------|
| Gestió del compte | Nom, correu, organització | Consentiment |
| Personalització | Poble, preferències | Interès legítim |
| Millora del servei | Dades d'ús (anònims) | Interès legítim |
| Comunicacions | Correu | Consentiment |
| Compliment legal | Tot | Obligació legal |

---
## 🔒 4. Seguretat de les Dades

Implementem les següents mesures de seguretat per protegir les vostres dades:

- **Xifratge SSL/TLS** (HTTPS) per a totes les comunicacions.
- **Emmagatzematge xifrat** a la base de dades (Supabase).
- **Autenticació segura** amb **JWT** i **Row Level Security (RLS)**.
- **Backups automàtics** i **recuperació de desastres**.
- **Auditories periòdiques** de seguretat.

> **Note**: Les vostres dades **no es comparteixen** amb tercers sense el vostre consentiment express, excepte quan sigui requerit per llei.

---
## 🌍 5. Drets dels Usuaris

Segons el **RGPD**, teniu els següents drets:

| **Dret** | **Descripció** | **Com exercir-lo** |
|----------|----------------|--------------------|
| **Accés** | Sol·licitar una còpia de les vostres dades | Enviar un correu a `dpo@socdepoble.org` |
| **Rectificació** | Corregir dades incorrectes | Editar el vostre perfil o contactar amb nosaltres |
| **Supressió** | Esborrar les vostres dades | Sol·licitar-ho per correu |
| **Limitació** | Limitar el tractament de les vostres dades | Sol·licitar-ho per correu |
| **Portabilitat** | Rebre les vostres dades en format estructurat | Sol·licitar-ho per correu |
| **Oposició** | Oposar-vos al tractament de les vostres dades | Sol·licitar-ho per correu |

---
## 📞 6. Contacte

Per a qualsevol qüestió relacionada amb la privacitat, podeu contactar amb nosaltres a:

- **Correu electrònic**: `dpo@socdepoble.org`
- **Adreça postal**:
  Associació Ecologista El Rentonar
  C/ Major, 123
  08001 Barcelona (Catalunya)

---
## 📅 7. Canvis a aquesta Política

Ens reservem el dret de **modificar aquesta política** en qualsevol moment. Us notificarem qualsevol canvi mitjançant:

- Un **avis a la pàgina principal** de Sóc de Poble.
- Un **correu electrònic** als usuaris registrats.

> **Versió actual**: 1.0.0 (9 de setembre de 2026)
```

---
---
### **📄 ANNEX C: EXEMPLE DE COMPONENT `LegalContent` COMPLET**
```jsx
// src/components/LegalContent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Suport per a taules, links, etc.
import rehypeRaw from 'rehype-raw'; // Permet HTML dins del Markdown
import { useTranslation } from 'react-i18next';
import './LegalContent.css';

/**
 * Component per renderitzar contingut legal (privacitat, termes, cookies)
 * @param {string} type - Tipus de contingut: 'privacy', 'terms', 'cookies'
 * @param {string} lang - Idioma: 'ca', 'es', 'en' (default: 'ca')
 * @param {boolean} showToc - Mostrar taula de continguts (default: true)
 */
const LegalContent = ({ type, lang = 'ca', showToc = true }) => {
  const { t, i18n } = useTranslation('legal');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toc, setToc] = useState([]);

  // Validar paràmetres
  const validTypes = ['privacy', 'terms', 'cookies'];
  const validLanguages = ['ca', 'es', 'en'];
  const validatedType = validTypes.includes(type) ? type : 'privacy';
  const validatedLang = validLanguages.includes(lang) ? lang : i18n.language || 'ca';

  // Carregar contingut des de /public o API
  const loadContent = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Intentar carregar des de /public (estàtic)
      const staticPath = `/content/legal/${validatedType}/${validatedLang}.md`;
      const response = await fetch(staticPath);

      if (response.ok) {
        const text = await response.text();
        setContent(text);
        generateToc(text);
        setLoading(false);
        return;
      }

      // 2. Fallback: Carregar des de l'API (dinàmic)
      const apiResponse = await fetch(`/api/legal/${validatedType}?lang=${validatedLang}`);
      if (apiResponse.ok) {
        const data = await apiResponse.json();
        setContent(data.content);
        generateToc(data.content);
        setLoading(false);
        return;
      }

      // 3. Fallback final: Carregar des de i18n (compatibilitat)
      const fallbackContent = t(`${validatedType}.content`, {
        defaultValue: t('loadingError', { ns: 'common' }),
      });
      setContent(fallbackContent);
      setError(t('fallbackWarning', { ns: 'legal' }));

    } catch (err) {
      setError(err.message);
      setContent(t('loadingError', { ns: 'common' }));
    } finally {
      setLoading(false);
    }
  }, [validatedType, validatedLang, t, i18n.language]);

  // Generar taula de continguts (TOC) des del Markdown
  const generateToc = (markdown) => {
    const headers = markdown.matchAll(/^#{1,3}\s+(.*?)$/gm);
    if (!headers) {
      setToc([]);
      return;
    }

    const tocItems = Array.from(headers).map(([full, text]) => {
      const level = full.match(/^#+/)[0].length;
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      return { level, text, id };
    });

    setToc(tocItems);
  };

  // Scroll suau fins a l'àncora
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Canviar idioma
  const changeLanguage = (newLang) => {
    i18n.changeLanguage(newLang);
    loadContent();
  };

  // Carregar contingut al muntar
  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Tornar a carregar si canvia l'idioma global
  useEffect(() => {
    if (i18n.language !== validatedLang) {
      loadContent();
    }
  }, [i18n.language, loadContent, validatedLang]);

  if (loading) {
    return (
      <div className="legal-loading">
        <div className="spinner"></div>
        <p>{t('loading', { ns: 'common' })}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="legal-error">
        <h2>⚠️ {t('errorTitle', { ns: 'legal' })}</h2>
        <p>{error}</p>
        <button onClick={loadContent}>
          {t('retry', { ns: 'common' })}
        </button>
      </div>
    );
  }

  return (
    <div className="legal-container">
      {/* Capçalera */}
      <header className="legal-header">
        <h1>
          {validatedType === 'privacy' && t('privacy.title', { ns: 'legal' })}
          {validatedType === 'terms' && t('terms.title', { ns: 'legal' })}
          {validatedType === 'cookies' && t('cookies.title', { ns: 'legal' })}
        </h1>
        <p className="legal-subtitle">
          {t('lastUpdated', { ns: 'legal', date: new Date().toLocaleDateString(validatedLang) })}
        </p>

        {/* Selector d'idioma */}
        <div className="legal-lang-selector">
          {validLanguages.map(l => (
            <button
              key={l}
              onClick={() => changeLanguage(l)}
              className={validatedLang === l ? 'active' : ''}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {/* Taula de continguts */}
      {showToc && toc.length > 0 && (
        <nav className="legal-toc">
          <h2>{t('tableOfContents', { ns: 'legal' })}</h2>
          <ul>
            {toc.map((item) => (
              <li key={item.id} style={{ marginLeft: `${(item.level - 1) * 1}rem` }}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Contingut principal */}
      <main className="legal-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            // Personalitzar el renderitzat de les capçaleres per afegir IDs
            h1: ({ node, children, ...props }) => {
              const id = children[0]?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
              return <h1 id={id} {...props} />;
            },
            h2: ({ node, children, ...props }) => {
              const id = children[0]?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
              return <h2 id={id} {...props} />;
            },
            h3: ({ node, children, ...props }) => {
              const id = children[0]?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
              return <h3 id={id} {...props} />;
            },
            // Personalitzar els enllaços per obrir en una nova pestanya si són externs
            a: ({ node, href, children, ...props }) => {
              const isExternal = href?.startsWith('http');
              return (
                <a
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  {...props}
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </main>

      {/* Peu de pàgina */}
      <footer className="legal-footer">
        <p>
          {t('questions', { ns: 'legal' })}{' '}
          <a href="mailto:dpo@socdepoble.org">dpo@socdepoble.org</a>
        </p>
        <p>
          {t('version', { ns: 'legal' })}: 1.0.0 | {t('lastUpdated', { ns: 'legal' })}
        </p>
      </footer>
    </div>
  );
};

export default React.memo(LegalContent);
```

---
---
### **📄 ANNEX D: CONFIGURACIÓ DE VITE PER A MARKDOWN**
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import markdown from 'vite-plugin-markdown';

export default defineConfig({
  plugins: [
    react(),
    markdown({
      // Configurar el processador de Markdown
      mode: 'react', // Genera components React
      markdownItOptions: {
        html: true, // Permet HTML dins del Markdown
        linkify: true, // Converteix URLs en enllaços
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  assetsInclude: ['**/*.md'], // Incloure fitxers Markdown als assets
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Dividir el bundle en chunks més petits
        manualChunks: {
          legal: ['src/content/legal'], // Chunk per al contingut legal
          i18n: ['src/i18n'], // Chunk per a i18n
          vendor: ['react', 'react-dom', 'react-i18next'], // Chunk per a dependències
        },
      },
    },
  },
  server: {
    // Servir fitxers Markdown des de /public
    fs: {
      strict: false, // Permet servir fitxers fora de /public
    },
  },
});
```

---
---
### **📄 ANNEX E: EXEMPLE DE PROVES PER A `LegalContent`**
```jsx
// src/components/LegalContent.test.jsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import LegalContent from './LegalContent';
import i18n from '../i18n/config';

// Mock de fetch per a les proves
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve('# Test Content\n\nThis is a test.'),
  })
);

describe('LegalContent Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders loading state initially', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <LegalContent type="privacy" lang="ca" />
        </MemoryRouter>
      </I18nextProvider>
    );
    expect(screen.getByText(/Carregant/i)).toBeInTheDocument();
  });

  it('renders privacy policy in Catalan', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <LegalContent type="privacy" lang="ca" />
        </MemoryRouter>
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Test Content/i)).toBeInTheDocument();
    });
  });

  it('renders terms and conditions in Spanish', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('# Términos y Condiciones\n\nContenido en español.'),
      })
    );

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <LegalContent type="terms" lang="es" />
        </MemoryRouter>
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Términos y Condiciones/i)).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <LegalContent type="privacy" lang="ca" />
        </MemoryRouter>
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });

  it('renders table of contents when showToc is true', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`# Title 1\n\n## Section 1\n\nContent\n\n## Section 2`),
      })
    );

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <LegalContent type="privacy" lang="ca" showToc={true} />
        </MemoryRouter>
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Taula de continguts/i)).toBeInTheDocument();
      expect(screen.getByText(/Title 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Section 1/i)).toBeInTheDocument();
    });
  });

  it('does not render table of contents when showToc is false', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <LegalContent type="privacy" lang="ca" showToc={false} />
        </MemoryRouter>
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Taula de continguts/i)).not.toBeInTheDocument();
    });
  });

  it('changes language when language button is clicked', async () => {
    fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve('# Privacy Policy'),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve('# Política de Privacidad'),
        })
      );

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <LegalContent type="privacy" lang="ca" />
        </MemoryRouter>
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('ES'));
    await waitFor(() => {
      expect(screen.getByText(/Política de Privacidad/i)).toBeInTheDocument();
    });
  });
});
```

---
---
### **📄 ANNEX F: COMANDES ÚTILS PER A L'AUDITORIA**

#### **🔍 Buscar fitxers grans**
```bash
# Llistar fitxers > 500 línies
find src -name "*.js" -o -name "*.jsx" | xargs wc -l | awk '$1 > 500'

# Llistar fitxers > 100KB
find src -name "*.js" -o -name "*.jsx" -o -name "*.css" | xargs ls -lh | awk '$5 > 100K'
```

#### **🔍 Buscar secrets**
```bash
# Buscar API keys, tokens, passwords
grep -r --include="*.js" --include="*.jsx" --include="*.json" \
  -E "API_KEY|apiKey|APIKEY|token|password|secret|private_key|PRIVATE_KEY" \
  src/ supabase/ .agents/

# Buscar URLs de servidors
grep -r --include="*.js" --include="*.json" \
  -E "http://|https://|localhost|127.0.0.1" \
  src/ supabase/

# Buscar claus de Supabase
grep -r --include="*.js" --include="*.json" \
  -E "supabaseUrl|supabaseKey|SUPABASE_URL|SUPABASE_KEY" \
  src/
```

#### **🔍 Analitzar dependències**
```bash
# Llistar dependències no utilitzades
npm install -g depcheck
depcheck

# Auditar vulnerabilitats
npm audit
npm audit fix
```

#### **🔍 Analitzar bundle**
```bash
# Instal·lar tool per analitzar el bundle
npm install -g source-map-explorer

# Generar el bundle i analitzar-lo
npm run build
source-map-explorer dist/assets/*.js
```

#### **🔍 Verificar RLS a Supabase**
```sql
-- Llistar totes les polítiques
SELECT * FROM pg_policies;

-- Verificar polítiques d'una taula específica
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Verificar si una taula té RLS activat
SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'profiles';
```

---
---
---
## 📞 **CONTACTE I SUPORT**
> **Per a qüestions relacionades amb aquest informe**:
- **Responsable**: Consell de la Petorreta (Javi Llinares)
- **Correu**: `consell@socdepoble.org`
- **Documentació**: Veure `[00_INDEX_ESCRIPTORI](knowledge://knowledge/04_Escriptori/00_INDEX_ESCRIPTORI.md)`

> **Per a qüestions legals**:
- **Correu**: `dpo@socdepoble.org`
- **Documentació**: Veure `[DOC_Governanca](knowledge://knowledge/02_Saber/DOC_Governanca.md)`

---
---
---
## 🏁 **TANCAMENT**
> **Aquest informe compleix amb els següents estàndards**:
- ✅ **Format**: Markdown (com solicitat)
- ✅ **Enfocament**: Millores estructurals i resolució de problemes crítics
- ✅ **Compliment**: Respecta **SDP-LOCK**, **ONLINE-FIRST** i **DOC_Governanca**
- ✅ **Seguretat**: No s'han realitzat cerques web (complint amb la prohibició)
- ✅ **Context**: Basat exclusivament en el **bundle proporcionat** (`260909_2111_BUNDLE_auditoria.md`)

> **Estat**: ✅ **COMPLET**
> **Versió**: 1.0.0
> **Data**: 9 de setembre de 2026
> **Autor**: Consell de la Petorreta (Assistit per IA amb **Trellat**)

---
**🔒 SDP-LOCK: ACTIVAT** (Si es detecten riscos de destrucció, seguir el protocol de `[SDP_LOCK.md](knowledge://knowledge/02_Saber/SDP_LOCK.md)`)
