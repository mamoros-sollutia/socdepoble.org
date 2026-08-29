# Pegats quirúrgics

Els fitxers d'aquest paquet que venen sencers (`design_guard.mjs`, `tractor-vocabulari.mjs`, `tractor-rutes.mjs`, `project_paths.mjs`, `termodinamic.mjs`, `despertar.mjs`, `storage.js`, `oauthRelay.js`, `callback.html`) es poden copiar tal qual.

Els que venen ací són retalls: els fitxers són grans i els meus venen del bundle, que pot estar arrere respecte del teu disc. Aplica'ls a mà.

---

## 1. `src/data/supabaseBackend.js` — substituir `loginWithGoogle`

**Lleva** les línies 818-826 senceres:

```js
export function loginWithGoogle(config = {}) {
  const { hasSupabaseConfig, supabaseUrl } = getResolvedConfig(config);
  if (!hasSupabaseConfig) {
    throw new Error('Google Auth requereix connexió amb Supabase.');
  }
  const redirectUrl = window.location.origin + window.location.pathname;
  window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl)}`;
}
```

**Posa** al seu lloc:

```js
import { entraAmbGoogle, gestionaTornada } from './oauthRelay.js';

/**
 * L'anterior enviava l'usuari a Google amb `redirect_to = origin + pathname`.
 * Com que eixe origen no estava a la llista blanca, GoTrue no fallava: queia
 * al SITE_URL i l'usuari acabava sempre a socdepoble.org. I ningú llegia la
 * tornada, així que ni tan sols des d'allí s'hauria guardat la sessió.
 *
 * Ara: relé fix + PKCE + finestra emergent. Torna una promesa amb la sessió.
 */
export function loginWithGoogle(config = {}) {
  return entraAmbGoogle(config, getResolvedConfig);
}

/** Crida-la una vegada quan l'app es munte. */
export function recullTornadaOAuth(config = {}) {
  return gestionaTornada(config, getResolvedConfig);
}
```

I exporta les dues a `src/data/backendPort.js`, al costat de les que ja hi ha:

```js
recullTornadaOAuth: supabaseImpl.recullTornadaOAuth,
// ...
export const recullTornadaOAuth = (...args) => currentImpl.recullTornadaOAuth(...args);
```

---

## 2. `src/data/supabaseBackend.js` — tancar la porta del darrere de superadmin

Línies 760-815. Ara mateix, si `hasSupabaseConfig` és fals — variables d'entorn absents al build, o `externalConfig` no injectat a l'embed de Sollutia — qualsevol correu i contrasenya retornen:

```js
{ id: 'local-mock-superadmin', user_metadata: { role: 'superadmin' } }
```

I `AppDataContext.jsx:384` llig eixe rol per a obrir la superfície d'administració. És només client, però un forat de configuració viatja: el dia que l'amfitrió s'oblide de passar la config, qualsevol entra com a tu.

Al principi del fitxer:

```js
/**
 * El mode simulat només ha d'existir en desenvolupament. En un build de
 * producció sense config, l'aplicació ha de dir que no pot entrar — no
 * regalar una sessió d'administrador.
 */
const MODE_SIMULAT_PERMES =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.DEV === true
    : false;

function usuariSimulat(email, name) {
  if (!MODE_SIMULAT_PERMES) {
    throw new Error(
      'No hi ha connexió configurada amb el servidor. ' +
      'Falten VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY, o l\'amfitrió no ha passat la configuració.'
    );
  }
  console.warn('[SDP] MODE SIMULAT: sessió local sense servidor. Mai en producció.');
  return {
    id: 'local-mock-usuari',
    email,
    // Rol mínim, no superadmin. Per a provar l'administració, entra de veres.
    user_metadata: { name: name || 'Usuari de proves', role: 'user' }
  };
}
```

I als dos blocs `if (!hasSupabaseConfig) { ... }` de `registerWithEmail` i `loginWithEmail`, canvia el cos per:

```js
if (!hasSupabaseConfig) {
  const mockUser = usuariSimulat(email, name);   // a loginWithEmail, sense `name`
  setVal('socdepoble-jwt', 'mock-jwt-token');
  setVal('socdepoble-user', mockUser);
  return { access_token: 'mock-jwt-token', user: mockUser };
}
```

Si necessites provar la vista d'administrador en local, posa `role: 'superadmin'` darrere d'una variable d'entorn explícita (`VITE_SDP_MOCK_SUPERADMIN=1`), mai per defecte.

---

## 3. `src/sections/login/LoginSection.jsx` — el botó ara espera

`handleGoogleLogin` era síncron perquè la funció anterior no tornava res. Ara torna una promesa:

```js
const handleGoogleLogin = async () => {
  setIsLoading(true);
  try {
    await loginWithGoogle(externalConfig);
    showToast(t('section.login.success.login', 'Benvingut de nou!'), 'success');
    window.dispatchEvent(new CustomEvent('sdp:auth-change'));
    navigate('/xat', { replace: true });
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    setIsLoading(false);
  }
};
```

---

## 4. `src/app/App.jsx` — recollir la tornada al muntatge

Sense açò, el camí de redirecció completa (iPads amb emergents bloquejats) no es tanca mai. Una sola vegada, al muntatge, abans de pintar:

```js
import { useEffect, useRef } from 'react';
import { recullTornadaOAuth } from '../data/backendPort.js';
import { showToast } from '../components/universal/AvisadorEfimer';

// dins del component:
const tornadaFeta = useRef(false);
useEffect(() => {
  if (tornadaFeta.current) return;   // StrictMode munta dues voltes
  tornadaFeta.current = true;
  recullTornadaOAuth(externalConfig)
    .then((sessio) => { if (sessio) showToast('Ja has entrat.', 'success'); })
    .catch((e) => showToast(e.message, 'error'));
}, []);
```

---

## 5. `package.json` — la porta

```diff
 "scripts": {
+  "despertar": "node tooling/brain/despertar.mjs",
   "porta:shim": "node tooling/gates/tractor-shim.mjs",
   "porta:outbox": "node tooling/gates/tractor-outbox.mjs",
   "porta:manual": "node tooling/gates/tractor-manual.mjs",
   "porta:consell": "node tooling/gates/tractor-consell.mjs",
+  "porta:rutes": "node tooling/gates/tractor-rutes.mjs",
+  "porta:vocabulari": "node tooling/gates/tractor-vocabulari.mjs",
+  "porta:baseline": "node tooling/brain/tractor-pedra-seca.mjs --baseline && node tooling/gates/design_guard.mjs --baseline && node tooling/gates/tractor-vocabulari.mjs --baseline",
-  "porta": "node tooling/wiki/tractor-cognitiu.mjs --arrel=. && npm run porta:manual && npm run porta:consell && node tooling/gates/tractor-registre.mjs && node tooling/gates/tractor-doctrina.mjs && node tooling/brain/tractor-pedra-seca.mjs && node tooling/gates/design_guard.mjs && npm run porta:outbox && node tooling/gates/tractor-persistencia.mjs && npm run porta:shim && node tooling/gates/build-seo-manifest.mjs --verifica",
+  "porta": "npm run porta:rutes && node tooling/wiki/tractor-cognitiu.mjs --arrel=. && npm run porta:manual && npm run porta:consell && node tooling/gates/tractor-registre.mjs && node tooling/gates/tractor-doctrina.mjs && node tooling/brain/tractor-pedra-seca.mjs && node tooling/gates/design_guard.mjs --arrel=src && npm run porta:vocabulari && npm run porta:outbox && node tooling/gates/tractor-persistencia.mjs && npm run porta:shim && node tooling/gates/build-seo-manifest.mjs --verifica",
 }
```

`porta:rutes` va **primer** a propòsit: és la porta que comprova que les altres portes existixen i tenen entrada CLI. Si algú torna a deixar un tractor sense CLI, salta abans que la cadena arribe a executar-lo per no res.

---

## 6. Configuració fora del codi

**Supabase › Authentication › URL Configuration › Redirect URLs** — una entrada, i prou:

```
https://auth.socdepoble.cat/callback
```

Si el teu GoTrue no accepta la query `?sdp_origin=`, afig també `https://auth.socdepoble.cat/callback*`. Comprova-ho amb una entrada de prova abans de donar-ho per fet.

**Google Cloud Console** — no cal tocar res. Allí ja hi ha el callback de Supabase (`https://<ref>.supabase.co/auth/v1/callback`) i eixe no canvia.

**`src/config/app.js`** — afig `oauthRelayUrl` a la configuració externa perquè Sollutia puga apuntar al seu relé sense recompilar:

```js
oauthRelayUrl: import.meta.env.VITE_SDP_OAUTH_RELAY || 'https://auth.socdepoble.cat/callback',
```
