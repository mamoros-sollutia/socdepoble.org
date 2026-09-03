# Pedaços de Seguretat de Claude (P0)
Data: 2026-09-03
Referència: P0 · Frontera de Credencials i Cursa d'Arrencada

**`wordpress-plugin/soc-de-poble.php`** — reemplaça `sdp_render()` sencera:

```php
function sdp_render( $atts = array() ) {
	$atts = shortcode_atts(
		array(
			'base_path'      => '',
			'data_mode'      => 'remote',
			'config'         => '',
			// Només `blank.php` ha de demanar-ho: [soc_de_poble pinta_amfitrio="1"]
			'pinta_amfitrio' => '',
		),
		$atts,
		'soc_de_poble'
	);

	$base_path = trim( (string) $atts['base_path'] );

	if ( '' === $base_path ) {
		$base_path = sdp_base_path();
	}

	$base_path         = '/' . trim( $base_path, '/' );
	$atts['base_path'] = '/' === $base_path ? '/' : untrailingslashit( $base_path );

	// Idempotent: si `sdp_encuar_aviat` ja ho ha fet, no passa res.
	wp_enqueue_style( SDP_HANDLE . '-fonts' );
	wp_enqueue_script( SDP_HANDLE );

	$config = array();
	if ( '' !== $atts['config'] ) {
		$desat = json_decode( $atts['config'], true );
		if ( is_array( $desat ) ) {
			$permeses = array( 'theme', 'lang', 'dataMode', 'showMenu', 'layout' );
			foreach ( $permeses as $key ) {
				if ( isset( $desat[ $key ] ) ) {
					$config[ $key ] = sanitize_text_field( $desat[ $key ] );
				}
			}
		}
	}

	$config['pluginUrl'] = plugin_dir_url( __FILE__ );
	$config['version']   = SDP_VERSIO;   // assetResolver.js espera un valor real ací
	$config['basePath']  = $atts['base_path'];

	/**
	 * Tot el que s'injecte per este filtre serà públic al codi font de la pàgina.
	 */
	$config = apply_filters( 'sdp_config_publica', $config, $atts );

	/**
	 * FRONTERA DE CREDENCIALS (P0 · 260903).
	 * L'origen de Supabase ix NOMÉS de constants del servidor. Mai d'un
	 * atribut de shortcode ni de bloc: `shortcode_atts()` deixa que
	 * l'atribut escrit sobreescriga el valor per defecte, i qualsevol
	 * autor amb `publish_posts` podia apuntar el component a un origen
	 * forà. `sanejaConfig()` valida el protocol, no l'origen: un
	 * `https://collidor.exemple` passava net i s'enduia les credencials
	 * escrites al formulari d'entrada.
	 */
	$supabase_url      = defined( 'SDP_SUPABASE_URL' ) ? SDP_SUPABASE_URL : '';
	$supabase_anon_key = defined( 'SDP_SUPABASE_ANON_KEY' ) ? SDP_SUPABASE_ANON_KEY : '';

	static $instancia = 0;
	$instancia++;
	$config_id = 'sdp-config-' . $instancia . '-' . wp_generate_password( 8, false, false );

	// Atribut booleà: o hi és o no hi és. Mai `pinta-amfitrio="0"`, que en HTML
	// seria cert igualment i faria exactament el contrari del que sembla.
	$pinta = filter_var( $atts['pinta_amfitrio'], FILTER_VALIDATE_BOOLEAN ) ? ' pinta-amfitrio' : '';

	return sprintf(
		'<script type="application/json" id="%1$s">%2$s</script>' .
		'<soc-de-poble base-path="%3$s" data-mode="%4$s" plugin-url="%6$s" fonts-href="%5$s" config-id="%1$s"%7$s supabase-url="%8$s" supabase-anon-key="%9$s"></soc-de-poble>',
		esc_attr( $config_id ),
		wp_json_encode( $config, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT ),
		esc_attr( $atts['base_path'] ),
		esc_attr( $atts['data_mode'] ),
		esc_url( sdp_url( 'assets/fonts/noto-sans.css' ) ),
		esc_url( $config['pluginUrl'] ),
		$pinta,
		esc_url( $supabase_url ),
		esc_attr( $supabase_anon_key )
	);
}
add_shortcode( 'soc_de_poble', 'sdp_render' );
```

**`wordpress-plugin/soc-de-poble.php`** — dins de `sdp_registrar_bloc()`, reemplaça el bloc `'attributes'`:

```php
			'attributes'      => array(
				'base_path' => array( 'type' => 'string', 'default' => '' ),
				'data_mode' => array( 'type' => 'string', 'default' => 'remote' ),
				'config'    => array( 'type' => 'string', 'default' => '' ),
			),
```

---

**`src/utils/sanitize.js`** — reemplaça des de `let ganxosPosats` fins al final de `sanitizeHtml()`:

```js
let ganxosPosats = false;

function posaGanxos() {
  if (ganxosPosats) return;
  ganxosPosats = true;

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    // 1. Cap far de tercers. Només imatges del nostre origen o data: URI.
    if (node.tagName === 'IMG') {
      const src = node.getAttribute('src') || '';
      const esLocal =
        src.startsWith('/') ||
        src.startsWith('./') ||
        src.startsWith('data:image/') ||
        (typeof window !== 'undefined' && src.startsWith(window.location.origin));
      if (!esLocal) {
        node.removeAttribute('src');
        node.setAttribute('alt', node.getAttribute('alt') || 'Imatge externa bloquejada');
        node.setAttribute('data-sdp-bloquejada', '1');
      }
      node.setAttribute('loading', 'lazy');
      node.setAttribute('decoding', 'async');
      node.setAttribute('referrerpolicy', 'no-referrer');
    }

    // 2. Cap segrest de pestanya, i cap fuita de referent.
    if (node.tagName === 'A' && node.hasAttribute('href')) {
      node.setAttribute('rel', 'noopener noreferrer nofollow');
      if (node.getAttribute('target') === '_blank') {
        node.setAttribute('target', '_blank');
      }
    }
  });
}

/**
 * P0 · 260903 — el ganxo s'arma en CARREGAR EL MÒDUL, no dins de
 * sanitizeHtml(). `DOMPurify.addHook` és estat global: mentres depenia
 * d'una crida, qualsevol camí que tocara DOMPurify directament corria
 * amb ganxo o sense segons quina pàgina s'haguera pintat primer. Un
 * control de seguretat no pot dependre de l'ordre de renderitzat.
 */
posaGanxos();

export function sanitizeHtml(html) {
  if (!html) return '';
  return DOMPurify.sanitize(String(html), {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'span', 'div', 'img', 'hr', 'code', 'pre'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'class', 'src', 'alt',
      'width', 'height', 'loading', 'decoding', 'referrerpolicy',
      'data-sdp-bloquejada'
    ],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'form', 'input', 'svg', 'math'],
    FORBID_ATTR: ['style', 'srcset', 'formaction', 'ping']
  });
}
```

**`src/sections/detail/detailRichText.jsx`** — línies 1–2:

```jsx
import { sanitizeHtml } from '../../utils/sanitize';
```

**`src/sections/detail/detailRichText.jsx`** — reemplaça `renderPageHtml()`:

```jsx
export function renderPageHtml(text) {
  const html = String(text || '')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="detail-content__img" />')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');

  return sanitizeHtml(html);
}
```

**`src/css/index.css`** — afig al bloc de `.detail-content`:

```css
/* Substituïx l'estil en línia que injectava renderPageHtml(). FORBID_ATTR
   esborra `style`, així que la mida ha de viure ací amb tokens. */
.detail-content__img {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: var(--sdp-radi-m);
  margin: var(--sdp-space-5) 0;
}
```

---

**`src/host.js`** — reemplaça des de `/* Estat de l'arrencada */` la declaració d'estat i les funcions `arrenca`, `arrencaAuto` i `exposaGlobal`:

```js
const FASE = { CONFIGURABLE: 'configurable', SEGELLAT: 'segellat' };
let fase = FASE.CONFIGURABLE;
let autoProgramada = false;
let arrencada = null;
```

```js
/**
 * Congela el backend i defineix `<soc-de-poble>`. Idempotent.
 *
 * CURSA CORREGIDA (260903): `fase` es marcava DESPRÉS de l'`await import()`.
 * Durant eixa finestra:
 *   · un segon `arrenca()` travessava el guard i cridava `defineCustomElement()`
 *     dos voltes → NotSupportedError;
 *   · un `configura()` tardà passava net i després quedava sobreescrit en
 *     silenci pel backend de Supabase.
 * Ara el segellat es marca SÍNCRONAMENT i la faena asíncrona viu en una
 * promesa memoritzada.
 *
 * @returns {Promise<{fase: string, backend: string[]}>}
 */
export function arrenca() {
  if (arrencada) return arrencada;

  fase = FASE.SEGELLAT;

  arrencada = (async () => {
    const injectats = Object.keys(getBackendImplementation());

    if (injectats.length > 0) {
      // Mode estricte: si s'ha injectat, ha de ser el contracte sencer.
      const pendents = CONTRACTE_BACKEND.filter((k) => !injectats.includes(k));
      if (pendents.length > 0) {
        throw new Error(
          `[host] Injecció incompleta. No es permet fusió amb Supabase. Falten mètodes: ${pendents.join(', ')}`,
        );
      }
    } else {
      // Fail-closed: si el backend per defecte no carrega, NO congelem una
      // implementació buida ni pintem l'element. Abans es feia console.error
      // i es continuava: l'app es muntava sencera amb totes les crides de
      // dades fallant, que és pitjor que no muntar-se.
      const supabaseImpl = await import('./data/supabaseBackend.js');
      setBackendImplementation(supabaseImpl);
    }

    freezeImplementation();
    defineCustomElement();
    return { fase, backend: Object.keys(getBackendImplementation()) };
  })();

  return arrencada;
}
```

```js
/**
 * Arrencada automàtica per als entorns que no configuren res (WordPress).
 *
 * `setTimeout(…, 0)` és una MACROtasca, no una microtasca: la finestra
 * d'injecció és més ampla del que deia el comentari anterior. Tot i així
 * només arriba a temps un `<script>` SÍNCRON del host. Amb `defer`, `async`
 * o `type="module"` —el que fa `wp_enqueue_script` amb estratègia diferida—
 * el host arriba tard i `configura()` llançarà.
 */
export function arrencaAuto() {
  if (autoProgramada || fase === FASE.SEGELLAT) return;
  autoProgramada = true;
  const fes = () => {
    if (fase === FASE.SEGELLAT) return;
    arrenca().catch((e) => {
      console.error('[host] Arrencada fallida. El component no es muntarà:', e);
    });
  };
  if (typeof document !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(fes, 0), { once: true });
  } else {
    setTimeout(fes, 0);
  }
}
```

```js
/**
 * El build standalone no és ESM, així que un host que el carregue amb un
 * `<script>` pla necessita un global. És l'ÚNICA assignació a `window` del
 * projecte i està declarada ací, no escampada.
 *
 * IDEMPOTENT (260903): amb `configurable:false` i `writable:false`, una
 * segona crida —bloc i shortcode alhora en la mateixa pàgina, o dos
 * muntatges del bundle— llançava TypeError i matava el segon muntatge
 * sencer. Ara la segona crida torna l'API ja exposada.
 */
export function exposaGlobal(objectiu = (typeof window !== 'undefined' ? window : undefined)) {
  if (!objectiu) return null;

  const existent = Object.getOwnPropertyDescriptor(objectiu, 'SocDePoble');
  if (existent) return existent.value ?? null;

  const api = Object.freeze({ configura, arrenca, estat, CONTRACTE_BACKEND });
  Object.defineProperty(objectiu, 'SocDePoble', { value: api, writable: false, configurable: false });
  return api;
}
```
