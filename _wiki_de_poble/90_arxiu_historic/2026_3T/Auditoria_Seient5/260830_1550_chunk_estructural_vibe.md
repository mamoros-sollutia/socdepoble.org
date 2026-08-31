# BUNDLE ESTRUCTURAL - REVISIÓ VIBE

Aquest chunk conté els fitxers d'arquitectura i configuració (Vite, Package.json i el Plugin PHP de Sollutia).

### FITXER: package.json
```json
{
  "name": "socdepoble-react",
  "version": "1.0.0",
  "type": "module",
  "sideEffects": [
    "*.css",
    "src/PedraSecaEmbed.jsx",
    "src/main.jsx"
  ],
  "scripts": {
    "despertar": "node tooling/brain/despertar.mjs",
    "porta:arrel": "node tooling/gates/tractor-arrel.mjs",
    "porta:enxufe": "node tooling/gates/tractor-enxufe.mjs",
    "porta:maquinari": "node tooling/gates/tractor-doctrina-maquinari.mjs",
    "porta:build": "node tooling/gates/tractor-build-previ.mjs",
    "deute:revisa": "node tooling/brain/consolidar_baselines.mjs --revisa",
    "tancar": "node tooling/gates/tancament.mjs",
    "porta:shim": "node tooling/gates/tractor-shim.mjs",
    "porta:outbox": "node tooling/gates/tractor-outbox.mjs",
    "porta:manual": "node tooling/gates/tractor-manual.mjs",
    "porta:consell": "node tooling/gates/tractor-consell.mjs",
    "porta:rutes": "node tooling/gates/tractor-rutes.mjs",
    "porta:rutes-web": "node tooling/gates/tractor-rutes-web.mjs",
    "porta:vocabulari": "node tooling/gates/tractor-vocabulari.mjs",
    "porta:baseline": "node tooling/brain/tractor-pedra-seca.mjs --baseline && node tooling/gates/design_guard.mjs --baseline && node tooling/gates/tractor-vocabulari.mjs --baseline",
    "porta": "npm run porta:arrel && npm run porta:enxufe && npm run porta:maquinari && node tooling/gates/tractor-innerhtml.mjs && npm run porta:rutes && npm run porta:rutes-web && node tooling/wiki/tractor-cognitiu.mjs --arrel=. && npm run porta:manual && npm run porta:consell && node tooling/gates/tractor-registre.mjs && node tooling/gates/tractor-doctrina.mjs && node tooling/brain/tractor-pedra-seca.mjs && node tooling/gates/design_guard.mjs --arrel=src && npm run porta:vocabulari && npm run porta:outbox && node tooling/gates/tractor-persistencia.mjs && npm run porta:shim && node tooling/gates/build-seo-manifest.mjs --verifica",
    "gate": "npm run porta",
    "dev": "vite --host 0.0.0.0 --port 3340 --strictPort",
    "rag:build": "node -e \"import('./tooling/wiki/core/build_rag_index.mjs').then(m => m.run({root: '.'}))\"",
    "slugs:build": "node tooling/wiki/core/build_slug_index.mjs",
    "bundle": "node tooling/brain/crear_bundle.mjs",
    "build": "npm run gate && npm run rag:build && npm run slugs:build && npm run build:web && npm run build:wp && npm run build:seo",
    "build:seo": "node tooling/gates/build-seo-manifest.mjs --escriu",
    "build:web": "vite build",
    "build:wp": "vite build -c vite.standalone.config.js && mkdir -p wordpress-plugin/assets/fonts wordpress-plugin/assets/img && cp -r src/assets/fonts/* wordpress-plugin/assets/fonts/ && cp -r assets/img/* wordpress-plugin/assets/img/",
    "prepare": "husky",
    "preview": "vite preview --host 0.0.0.0",
    "db:seed:generate": "sh scripts/generate-supabase-seed.sh",
    "brain:maintain": "sh tooling/brain/maintain.sh .",
    "brain:distill": "python3 tooling/brain/brain_distill.py",
    "pdf:render": "sh tooling/pdf/render_pdf.sh",
    "test": "vitest",
    "lint": "eslint src tooling scripts"
  },
  "dependencies": {
    "dompurify": "^3.4.14",
    "lucide-react": "^1.35.0"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0",
    "react-router-dom": ">=6.0.0"
  },
  "devDependencies": {
    "@babel/parser": "^8.0.4",
    "@eslint/js": "^9.39.5",
    "@testing-library/react": "^16.3.2",
    "@vitejs/plugin-react": "^5.1.1",
    "css": "^3.0.0",
    "eslint": "^9.39.5",
    "eslint-plugin-react": "^7.37.5",
    "fake-indexeddb": "^6.2.5",
    "globals": "^17.9.0",
    "husky": "^9.1.7",
    "jsdom": "^29.1.1",
    "knip": "^6.32.2",
    "lint-staged": "^17.3.0",
    "postcss-prefix-selector": "^2.1.0",
    "puppeteer": "^25.5.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.12.0",
    "vite": "^7.1.0",
    "vitest": "^4.1.10"
  },
  "engines": {
    "node": ">=20"
  },
  "private": true
}

```

### FITXER: vite.config.js
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ command }) => ({
  plugins: [
    react()
  ],
  define: command === 'build' ? {
    'import.meta.env.VITE_SUPABASE_URL': '""',
    'import.meta.env.VITE_SUPABASE_ANON_KEY': '""'
  } : {},
  server: {
    host: true,
    port: 3340,
    strictPort: true,
    watch: {
      ignored: ['**/.agents/**', '**/_wiki_de_poble/**', '**/.gemini/**', '**/scripts/**']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    emptyOutDir: true
  }
}));

```

### FITXER: vite.standalone.config.js
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command }) => ({
  plugins: [react()],

  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    ...(command === 'build' ? {
      'import.meta.env.VITE_SUPABASE_URL': '""',
      'import.meta.env.VITE_SUPABASE_ANON_KEY': '""'
    } : {})
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'react/jsx-runtime': path.resolve(__dirname, 'src/shims/jsx-runtime.js')
    }
  },

  build: {
    outDir: 'wordpress-plugin/dist',
    emptyOutDir: true,
    target: 'es2019',
    copyPublicDir: false,
    cssCodeSplit: false,
    assetsInlineLimit: 4096,
    minify: 'esbuild',
    sourcemap: true,
    reportCompressedSize: true,

    lib: {
      entry: path.resolve(__dirname, 'src/wp-standalone.js'),
      name: 'SocDePoble',
      formats: ['iife'],
      fileName: () => 'soc-de-poble.standalone.js'
    },

    rollupOptions: {
      external: ['react', 'react-dom', 'react-dom/client'],
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'soc-de-poble.standalone.js',
        assetFileNames: 'assets/[name][extname]',
        globals: {
          'react': 'wp.element',
          'react-dom': 'wp.element',
          'react-dom/client': 'wp.element'
        }
      }
    }
  }
}));

```

### FITXER: wordpress-plugin/soc-de-poble.php
```php
<?php
/**
 * Plugin Name: Sóc de Poble — Pedra Seca
 * Description: Munta el Web Component <soc-de-poble> dins de WordPress i li cedeix un prefix d'URL sencer.
 * Version:     1.1.0
 * Requires PHP: 7.4
 * License:     AGPL-3.0-or-later
 * Text Domain: soc-de-poble
 *
 * ARQUITECTURA
 * -----------------------------------------------------------------------
 * 1. FONTS AL DOCUMENT. Un `@font-face` dins d'un shadow root no es registra
 *    mai. WordPress encua `noto-sans.css` pel seu compte i passa l'URL per
 *    l'atribut `fonts-href`.
 *
 * 2. REACT EMPAQUETAT. El bundle standalone porta el seu propi React. No depén
 *    de `wp-element` ni de la versió de React del tema. És un IIFE clàssic,
 *    NO un mòdul ESM: per això no hi ha cap filtre `type="module"`.
 *
 * 3. CONFIG PER JSON. La configuració rica viatja en un `<script
 *    type="application/json">` que l'element llig per `config-id`. Cap secret
 *    del servidor ha d'anar ací.
 *
 * 4. SOBIRANIA DE RUTES. Tot el que penja del prefix de la pàgina amfitriona
 *    (p. ex. `/poble/...`) es resol a la mateixa pàgina amb HTTP 200 i el
 *    `BrowserRouter` decideix què pintar. Les regles es refresquen soles quan
 *    canvia la versió o la pàgina: no depenen que ningú recorde anar a
 *    Ajustos > Enllaços permanents.
 * -----------------------------------------------------------------------
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/inc/sdp-seo.php';
require_once __DIR__ . '/inc/sdp-tema.php';

const SDP_VERSIO           = '1.1.0';
const SDP_HANDLE           = 'soc-de-poble';
const SDP_OPCIO_PAGINA     = 'sdp_pagina_id';
const SDP_OPCIO_SIGNATURA  = 'sdp_signatura_rutes';

/** Prefixos que no podem segrestar mai, passe el que passe. */
function sdp_prefixos_reservats() {
	return apply_filters(
		'sdp_prefixos_reservats',
		array( 'wp-json', 'wp-admin', 'wp-content', 'wp-includes', 'wp-login', 'feed', 'sitemap', 'robots', 'xmlrpc' )
	);
}

function sdp_url( $rel ) {
	return plugins_url( $rel, __FILE__ );
}

/* ─────────────────────────── Pàgina amfitriona ─────────────────────────── */

/** ID de la pàgina que allotja l'aplicació. 0 = cap (el connector no toca rutes). */
function sdp_pagina_id() {
	$id = (int) apply_filters( 'sdp_pagina_id', (int) get_option( SDP_OPCIO_PAGINA, 0 ) );
	return $id > 0 ? $id : 0;
}

/** Camí de la pàgina sense barres: "poble" o "serveis/poble". '' si no n'hi ha. */
function sdp_prefix() {
	static $cache = null;
	if ( null !== $cache ) {
		return $cache;
	}

	$cache = '';
	$id    = sdp_pagina_id();
	if ( ! $id ) {
		return $cache;
	}

	$post = get_post( $id );
	if ( ! $post || 'publish' !== $post->post_status ) {
		return $cache;
	}

	$uri     = trim( (string) get_page_uri( $id ), '/' );
	$primer  = explode( '/', $uri )[0];

	if ( '' === $uri || in_array( $primer, sdp_prefixos_reservats(), true ) ) {
		return $cache;
	}

	$cache = $uri;
	return $cache;
}

/** basename per al BrowserRouter: "/poble". '/' si no hi ha pàgina configurada. */
function sdp_base_path() {
	$prefix = sdp_prefix();
	return '' === $prefix ? '/' : '/' . $prefix;
}

/**
 * PORTA MECÀNICA. Refresca les regles quan canvia la versió, la pàgina o el
 * prefix. Sense això, `add_rewrite_rule` és inert: WP llig l'opció
 * `rewrite_rules` en memòria cau i no la regenera mai tota sola.
 */
function sdp_refrescar_regles_si_cal() {
	$signatura = SDP_VERSIO . '|' . md5( sdp_route_pattern() ) . '|' . sdp_pagina_id() . '|' . sdp_prefix();
	if ( get_option( SDP_OPCIO_SIGNATURA ) === $signatura ) {
		return;
	}
	flush_rewrite_rules( false );
	update_option( SDP_OPCIO_SIGNATURA, $signatura, false );
}
add_action( 'init', 'sdp_refrescar_regles_si_cal', 99 );

register_activation_hook( __FILE__, function () {
	delete_option( SDP_OPCIO_SIGNATURA );
} );

register_deactivation_hook( __FILE__, function () {
	delete_option( SDP_OPCIO_SIGNATURA );
	flush_rewrite_rules( false );
} );

/** True si la petició actual és un subcamí cedit a React. */
function sdp_es_ruta_react() {
	return '' !== (string) get_query_var( 'sdp_ruta' );
}

/** True si la petició és la pàgina de l'app (arrel o subcamí). */
function sdp_es_pagina_app() {
	$id = sdp_pagina_id();
	return $id && ( is_page( $id ) || sdp_es_ruta_react() );
}

/* ─────────────────────────────── Actius ────────────────────────────────── */

function sdp_registrar_actius() {
	wp_register_style(
		SDP_HANDLE . '-fonts',
		sdp_url( 'assets/fonts/noto-sans.css' ),
		array(),
		SDP_VERSIO
	);

	// IIFE que depèn de wp-element per al React extern
	wp_register_script(
		SDP_HANDLE,
		sdp_url( 'dist/soc-de-poble.standalone.js' ),
		array( 'wp-element' ),
		SDP_VERSIO,
		true
	);

	if ( function_exists( 'wp_script_add_data' ) ) {
		wp_script_add_data( SDP_HANDLE, 'strategy', 'defer' );
	}
}
add_action( 'init', 'sdp_registrar_actius' );

/**
 * Encuem abans de `wp_head` quan sabem que la pàgina és l'app. Encuar només
 * dins de `sdp_render` (durant `the_content`) obliga WP a imprimir l'estil de
 * les fonts al peu: FOUC garantit i text sense font durant el primer pintat.
 */
function sdp_encuar_aviat() {
	if ( ! sdp_es_pagina_app() ) {
		return;
	}
	wp_enqueue_style( SDP_HANDLE . '-fonts' );
	wp_enqueue_script( SDP_HANDLE );
}
add_action( 'wp_enqueue_scripts', 'sdp_encuar_aviat' );

/* ─────────────────────────────── Render ────────────────────────────────── */

function sdp_render( $atts = array() ) {
	$atts = shortcode_atts(
		array(
			'base_path' => '',
			'data_mode' => 'remote',
			'config'    => '',
		),
		$atts,
		'soc_de_poble'
	);

	$base_path = trim( (string) $atts['base_path'] );

	if ( '' === $base_path ) {
		$base_path = sdp_base_path();
	}

	$base_path = '/' . trim( $base_path, '/' );
	$atts['base_path'] = '/' === $base_path ? '/' : untrailingslashit( $base_path );

	// Idempotent: si `sdp_encuar_aviat` ja ho ha fet, no passa res.
	wp_enqueue_style( SDP_HANDLE . '-fonts' );
	wp_enqueue_script( SDP_HANDLE );

	$config = array();
	if ( '' !== $atts['config'] ) {
		$desat = json_decode( $atts['config'], true );
		if ( is_array( $desat ) ) {
			// Qwenb: Validació de la Frontera de Confiança.
			// Evitar la injecció de metadades no autoritzades des del shortcode.
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

	static $instancia = 0;
	$instancia++;
	$config_id = 'sdp-config-' . $instancia . '-' . wp_generate_password( 8, false, false );

	return sprintf(
		'<script type="application/json" id="%1$s">%2$s</script>' .
		'<soc-de-poble base-path="%3$s" data-mode="%4$s" plugin-url="%6$s" fonts-href="%5$s" config-id="%1$s"></soc-de-poble>',
		esc_attr( $config_id ),
		wp_json_encode( $config, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT ),
		esc_attr( $atts['base_path'] ),
		esc_attr( $atts['data_mode'] ),
		esc_url( sdp_url( 'assets/fonts/noto-sans.css' ) ),
		esc_url( $config['pluginUrl'] )
	);
}
add_shortcode( 'soc_de_poble', 'sdp_render' );

/**
 * KSES: NO afegim `<soc-de-poble>` a la llista blanca.
 *
 * L'element només l'emet `sdp_render` (shortcode o bloc), mai el contingut
 * desat. Permetre'l obria dos forats reals a autors sense `unfiltered_html`:
 *   - `fonts-href` arbitrari  -> full d'estil de tercers carregat al document
 *     (CSS pot exfiltrar dades amb selectors d'atribut + background-image).
 *   - `config-id` arbitrari   -> l'element llig el textContent de qualsevol
 *     node de la pàgina i l'interpreta com a configuració.
 * Si algun dia cal escriure l'etiqueta a mà, allista NOMÉS `base-path` i
 * `data-mode`, mai els altres tres.
 */

/* ─────────────────────────────── Bloc ──────────────────────────────────── */

function sdp_registrar_bloc() {
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}
	register_block_type(
		'socdepoble/portal',
		array(
			'api_version'     => 3,
			'render_callback' => 'sdp_render',
			'attributes'      => array(
				'base_path' => array( 'type' => 'string', 'default' => '' ),
				'data_mode' => array( 'type' => 'string', 'default' => 'remote' ),
				'config'    => array( 'type' => 'string', 'default' => '' ),
			),
		)
	);
}
add_action( 'init', 'sdp_registrar_bloc' );

/* ─────────────────────────────── Plantilla ─────────────────────────────── */

function sdp_add_page_template( $templates ) {
	$templates['sdp-blank'] = 'Sóc de Poble (Pantalla Completa)';
	return $templates;
}
add_filter( 'theme_page_templates', 'sdp_add_page_template' );

function sdp_force_blank_template( $template ) {
	global $post;

	// `is_singular()` és fals en els subcamins reescrits fins que WP resol la
	// consulta; per això comprovem primer la ruta cedida.
	if ( sdp_es_ruta_react() ) {
		$candidata = plugin_dir_path( __FILE__ ) . 'templates/blank.php';
		return file_exists( $candidata ) ? $candidata : $template;
	}

	if ( ! $post || ! is_singular() ) {
		return $template;
	}

	$page_template = get_post_meta( $post->ID, '_wp_page_template', true );
	if (
		'sdp-blank' === $page_template
		|| has_shortcode( $post->post_content, 'soc_de_poble' )
		|| has_block( 'socdepoble/portal', $post )
	) {
		$candidata = plugin_dir_path( __FILE__ ) . 'templates/blank.php';
		if ( file_exists( $candidata ) ) {
			return $candidata;
		}
	}

	return $template;
}
add_filter( 'template_include', 'sdp_force_blank_template' );

/* ───────────────────── Ajust: quina pàgina és l'app ────────────────────── */

function sdp_registrar_ajust() {
	if ( ! is_admin() ) {
		return;
	}
	register_setting(
		'reading',
		SDP_OPCIO_PAGINA,
		array(
			'type'              => 'integer',
			'sanitize_callback' => 'absint',
			'default'           => 0,
		)
	);

	add_settings_field(
		SDP_OPCIO_PAGINA,
		'Pàgina de Sóc de Poble',
		function () {
			wp_dropdown_pages(
				array(
					'name'              => SDP_OPCIO_PAGINA,
					'selected'          => sdp_pagina_id(),
					'show_option_none'  => '— Cap (sense cessió de rutes) —',
					'option_none_value' => '0',
				)
			);
			$prefix = sdp_prefix();
			echo '<p class="description">Tot el que penge de <code>/'
				. esc_html( '' === $prefix ? '…' : $prefix )
				. '/</code> es cedirà al component React amb HTTP 200.</p>';
		},
		'reading'
	);
}
add_action( 'admin_init', 'sdp_registrar_ajust' );

```

### FITXER: wordpress-plugin/inc/sdp-seo.php
```php
<?php
/**
 * SEO, Routing i Sitemap compartit per la SPA Sóc de Poble
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

if ( ! defined( 'SDP_SEO_OWNER' ) ) {
  define( 'SDP_SEO_OWNER', 'sdp' ); // 'sdp', 'yoast' o 'rank_math'
}

function sdp_seo_manifest() {
  static $manifest = null;

  if ( null !== $manifest ) {
    return $manifest;
  }

  $path = plugin_dir_path( dirname( __FILE__ ) ) . 'dist/seo-routes.json';
  if ( ! is_readable( $path ) ) {
    return $manifest = array( 'routes' => array(), 'aliases' => array() );
  }

  $decoded = json_decode( (string) file_get_contents( $path ), true );
  return $manifest = is_array( $decoded )
    ? $decoded
    : array( 'routes' => array(), 'aliases' => array() );
}

function sdp_normalize_route( $route ) {
  $route = rawurldecode( (string) $route );
  $route = trim( preg_replace( '#/+#', '/', $route ), '/' );
  return preg_match( '#(?:^|/)\.\.(?:/|$)#', $route ) ? false : $route;
}

function sdp_seo_context() {
  if ( ! function_exists('sdp_es_pagina_app') || ! sdp_es_pagina_app() ) {
    return null;
  }

  $manifest = sdp_seo_manifest();
  $route = function_exists('sdp_es_ruta_react') && sdp_es_ruta_react()
    ? sdp_normalize_route( get_query_var( 'sdp_ruta' ) )
    : '';

  if ( false === $route ) {
    return null;
  }

  return $manifest['routes'][ $route ] ?? null;
}

function sdp_route_pattern() {
  $lists = array(
    'chat', 'xat', 'chats', 'mur', 'mercat', 'multimedia', 'pobles',
    'events', 'calendar', 'calendari', 'mapa', 'notes', 'dispositius',
    'connectivitat', 'cerca', 'login', 'accedir', 'registre',
    'crear-compte', 'perfil', 'control', 'connectar', 'projecte',
    'el-projecte', 'skills', 'constitucio', 'disseny', 'legal',
    'roadmap', 'ruta', 'versions', 'traduccions', 'realitat',
    'ia', 'anima', 'iaia', 'poblacio'
  );

  $lists = implode( '|', array_map(
    static fn( $route ) => preg_quote( $route, '#' ),
    $lists
  ) );

  $details = '(?:chat|xat|chats|post|page|perfil|gent|empresa|ajuntament|grup|mur|mercat|multimedia|pobles|events|notes)/[^/]+';

  return apply_filters(
    'sdp_route_pattern',
    '(?:' . $lists . '|' . $details . '|arbres/pi-pla-verd)'
  );
}

function sdp_registrar_regles() {
  if ( ! function_exists('sdp_prefix') || ! function_exists('sdp_pagina_id') ) return;
  
  $prefix = sdp_prefix();
  if ( '' === $prefix ) {
    return;
  }

  add_rewrite_rule(
    preg_quote( $prefix, '#' ) . '/(' . sdp_route_pattern() . ')/?$',
    'index.php?page_id=' . sdp_pagina_id() . '&sdp_ruta=$matches[1]',
    'top'
  );
}

function sdp_resolve_request() {
  if ( ! function_exists('sdp_es_ruta_react') || ! sdp_es_ruta_react() ) {
    return;
  }

  remove_action( 'template_redirect', 'redirect_canonical' );

  $route = sdp_normalize_route( get_query_var( 'sdp_ruta' ) );
  $manifest = sdp_seo_manifest();
  global $wp_query;

  if ( false === $route ) {
    $wp_query->set_404();
    status_header( 404 );
    nocache_headers();
    return;
  }

  $alias = $manifest['aliases'][ $route ] ?? null;

  if ( is_string( $alias ) && '' !== $alias ) {
    $target = $manifest['routes'][ $alias ] ?? null;
    if ( is_array( $target ) && 200 === (int) ( $target['status'] ?? 404 ) ) {
      wp_safe_redirect( sdp_route_url( $alias ), 301, 'Soc-de-Poble' );
      exit;
    }

    $wp_query->set_404();
    status_header( 404 );
    nocache_headers();
    return;
  }

  $context = $manifest['routes'][ $route ] ?? null;

  if ( ! is_array( $context ) || 200 !== (int) ( $context['status'] ?? 404 ) ) {
    $wp_query->set_404();
    status_header( 404 );
    nocache_headers();
    return;
  }

  $wp_query->is_404 = false;
  status_header( 200 );
}
add_action( 'template_redirect', 'sdp_resolve_request', 0 );

function sdp_route_url( $route ) {
  $route = sdp_normalize_route( $route );
  if ( false === $route ) {
    return '';
  }

  $path = trim( sdp_prefix() . '/' . $route, '/' );
  return home_url( user_trailingslashit( $path ) );
}

function sdp_current_route_url() {
  $route = ( function_exists('sdp_es_ruta_react') && sdp_es_ruta_react() )
    ? sdp_normalize_route( get_query_var( 'sdp_ruta' ) )
    : '';

  return false === $route ? '' : sdp_route_url( $route );
}

function sdp_canonical( $url ) {
  if ( ! sdp_es_ruta_react() && ! sdp_es_pagina_app() ) {
    return $url;
  }

  $context = sdp_seo_context();
  if ( ! is_array( $context ) || 200 !== (int) ( $context['status'] ?? 404 ) ) {
    return ''; // Cap canonical en un 404.
  }

  return sdp_current_route_url();
}

add_filter( 'get_canonical_url', 'sdp_canonical', 20 );
add_filter( 'wpseo_canonical', 'sdp_canonical', 20 );
add_filter( 'rank_math/frontend/canonical', 'sdp_canonical', 20 );

function sdp_filter_title( $title ) {
  $context = sdp_seo_context();
  return is_array( $context ) && ! empty( $context['title'] )
    ? (string) $context['title']
    : $title;
}

function sdp_filter_description( $description ) {
  $context = sdp_seo_context();
  return is_array( $context ) && ! empty( $context['description'] )
    ? (string) $context['description']
    : $description;
}

add_filter( 'pre_get_document_title', 'sdp_filter_title', 20 );
add_filter( 'wpseo_title', 'sdp_filter_title', 20 );
add_filter( 'rank_math/frontend/title', 'sdp_filter_title', 20 );
add_filter( 'wpseo_metadesc', 'sdp_filter_description', 20 );
add_filter( 'rank_math/frontend/description', 'sdp_filter_description', 20 );

add_filter( 'wp_robots', function ( $robots ) {
  $context = sdp_seo_context();
  if ( is_array( $context ) && empty( $context['index'] ) ) {
    unset( $robots['index'] );
    $robots['noindex'] = true;
    $robots['follow'] = true;
  }
  return $robots;
} );

add_filter( 'wpseo_robots', function ( $robots ) {
  $context = sdp_seo_context();
  return is_array( $context ) && empty( $context['index'] )
    ? 'noindex, follow'
    : $robots;
} );

add_filter( 'rank_math/frontend/robots', function ( $robots ) {
  $context = sdp_seo_context();
  if ( is_array( $context ) && empty( $context['index'] ) ) {
    $robots['index'] = 'noindex';
    $robots['follow'] = 'follow';
  }
  return $robots;
} );

function sdp_absolute_image_url( $value ) {
  $value = trim( (string) $value );
  if ( '' === $value ) {
    return '';
  }
  if ( wp_http_validate_url( $value ) ) {
    return $value;
  }
  if ( '/' === substr( $value, 0, 1 ) ) {
    return home_url( $value );
  }
  return plugins_url( ltrim( $value, '/' ), dirname(__FILE__) );
}

function sdp_print_route_meta() {
  $context = sdp_seo_context();
  if ( ! is_array( $context ) ) {
    return;
  }

  $title = (string) ( $context['title'] ?? '' );
  $description = (string) ( $context['description'] ?? '' );
  $canonical = sdp_current_route_url();
  $image = sdp_absolute_image_url( $context['image'] ?? '' );
  $type = (string) ( $context['type'] ?? 'website' );

  if ( '' !== $description ) {
    printf( "\n<meta name=\"description\" content=\"%s\">", esc_attr( $description ) );
  }
  printf( "\n<meta property=\"og:title\" content=\"%s\">", esc_attr( $title ) );
  printf( "\n<meta property=\"og:description\" content=\"%s\">", esc_attr( $description ) );
  printf( "\n<meta property=\"og:url\" content=\"%s\">", esc_url( $canonical ) );
  printf( "\n<meta property=\"og:type\" content=\"%s\">", esc_attr( $type ) );
  printf( "\n<meta name=\"twitter:card\" content=\"summary_large_image\">" );
  printf( "\n<meta name=\"twitter:title\" content=\"%s\">", esc_attr( $title ) );
  printf( "\n<meta name=\"twitter:description\" content=\"%s\">", esc_attr( $description ) );
  if ( '' !== $image ) {
    printf( "\n<meta property=\"og:image\" content=\"%s\">", esc_url( $image ) );
    printf( "\n<meta name=\"twitter:image\" content=\"%s\">", esc_url( $image ) );
  }

  if ( ! empty( $context['jsonLd'] ) && is_array( $context['jsonLd'] ) ) {
    $json_ld = array_merge(
      $context['jsonLd'],
      array(
        '@context' => 'https://schema.org',
        'url' => $canonical,
      )
    );
    printf(
      "\n<script type=\"application/ld+json\" data-sdp-route-jsonld>%s</script>",
      wp_json_encode(
        $json_ld,
        JSON_UNESCAPED_SLASHES |
        JSON_UNESCAPED_UNICODE |
        JSON_HEX_TAG |
        JSON_HEX_AMP |
        JSON_HEX_APOS |
        JSON_HEX_QUOT
      )
    );
  }
}

if ( 'sdp' === SDP_SEO_OWNER ) {
  add_action( 'wp_head', 'sdp_print_route_meta', 2 );
}

if ( class_exists( 'WP_Sitemaps_Provider' ) ) {
  final class SDP_Route_Sitemaps_Provider extends WP_Sitemaps_Provider {
    public function __construct() {
      $this->name = 'sdp';
      $this->object_type = 'sdp-route';
    }

    private function public_routes() {
      $routes = sdp_seo_manifest()['routes'] ?? array();

      return array_filter(
        $routes,
        static fn( $context ) =>
          is_array( $context ) &&
          ! empty( $context['index'] ) &&
          200 === (int) ( $context['status'] ?? 404 )
      );
    }

    public function get_url_list( $page_num, $object_subtype = '' ) {
      $per_page = min( 50000, max( 1, (int) wp_sitemaps_get_max_urls( $this->object_type ) ) );
      $offset = max( 0, ( (int) $page_num - 1 ) * $per_page );
      $page = array_slice( $this->public_routes(), $offset, $per_page, true );
      $urls = array();

      foreach ( $page as $route => $context ) {
        $entry = array( 'loc' => sdp_route_url( $route ) );
        if ( ! empty( $context['lastmod'] ) ) {
          $timestamp = strtotime( $context['lastmod'] );
          if ( false !== $timestamp ) {
            $entry['lastmod'] = gmdate( DATE_W3C, $timestamp );
          }
        }
        $urls[] = $entry;
      }

      return $urls;
    }

    public function get_max_num_pages( $object_subtype = '' ) {
      $per_page = min( 50000, max( 1, (int) wp_sitemaps_get_max_urls( $this->object_type ) ) );
      return (int) ceil( count( $this->public_routes() ) / $per_page );
    }
  }

  add_action( 'wp_sitemaps_init', function () {
    wp_register_sitemap_provider( 'sdp', new SDP_Route_Sitemaps_Provider() );
  } );
}

add_filter( 'query_vars', function ( $vars ) {
	if ( ! in_array( 'sdp_ruta', $vars, true ) ) {
		$vars[] = 'sdp_ruta';
	}
	return $vars;
} );

add_action( 'init', 'sdp_registrar_regles', 10 );

add_filter( 'get_canonical_url', function ( $url ) {
	return '' === $url ? get_permalink() : $url;
}, 30 );

add_action( 'admin_notices', function () {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$problemes = array();

	$manifest = plugin_dir_path( dirname( __FILE__ ) ) . 'dist/seo-routes.json';
	if ( ! is_readable( $manifest ) ) {
		$problemes[] = 'Falta <code>dist/seo-routes.json</code>. Sense ell, '
			. '<code>sdp_resolve_request()</code> marca 404 en TOTES les rutes React '
			. 'i no s\'emet cap metadada SEO.';
	}

	$prefix = function_exists( 'sdp_prefix' ) ? sdp_prefix() : '';
	if ( '' === $prefix ) {
		$problemes[] = 'Cap pàgina amfitriona configurada (Ajustos &gt; Lectura). '
			. 'El connector no cedix cap ruta.';
	} else {
		$regles = get_option( 'rewrite_rules', array() );
		$trobada = false;
		foreach ( array_keys( (array) $regles ) as $patro ) {
			if ( 0 === strpos( $patro, preg_quote( $prefix, '#' ) ) || 0 === strpos( $patro, $prefix ) ) {
				$trobada = true;
				break;
			}
		}
		if ( ! $trobada ) {
			$problemes[] = 'Cap regla de reescriptura per a <code>/' . esc_html( $prefix )
				. '/</code> a la base de dades. Aneu a Ajustos &gt; Enllaços permanents i deseu.';
		}
	}

	if ( ! $problemes ) {
		return;
	}

	echo '<div class="notice notice-error"><p><strong>Sóc de Poble — el bancal no passa:</strong></p><ul style="list-style:disc;margin-left:20px">';
	foreach ( $problemes as $p ) {
		echo '<li>' . wp_kses( $p, array( 'code' => array() ) ) . '</li>';
	}
	echo '</ul></div>';
} );

```

### FITXER: wordpress-plugin/inc/sdp-tema.php
```php
<?php
/**
 * Injecció inicial del Tema (Anti-FOUC) abans del primer pintat de React.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function sdp_bootstrap_theme() {
  if ( ! function_exists('sdp_es_pagina_app') || ! sdp_es_pagina_app() ) {
    return;
  }
  ?>
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" content="#fbfaf8" data-sdp-theme-color>
  <script>
  (function (d, w) {
    var key = 'socdepoble-theme-mode';
    var preference = 'system';

    try {
      var saved = w.localStorage.getItem(key);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        preference = saved;
      }
    } catch (_) {}

    var systemDark = !!(
      w.matchMedia &&
      w.matchMedia('(prefers-color-scheme: dark)').matches
    );
    var theme = preference === 'system'
      ? (systemDark ? 'dark' : 'light')
      : preference;

    d.documentElement.dataset.theme = theme;
    d.documentElement.dataset.themePreference = preference;
    d.documentElement.style.colorScheme = theme;

    var meta = d.querySelector('meta[data-sdp-theme-color]');
    if (meta) meta.content = theme === 'dark' ? '#0e0d0c' : '#fbfaf8';
  })(document, window);
  </script>
  <?php
}
add_action( 'wp_head', 'sdp_bootstrap_theme', 0 );

```

### FITXER: wordpress-plugin/templates/blank.php
```php
<?php
/**
 * Plantilla en blanc per a Sóc de Poble.
 * Elimina la capçalera, el peu i els marges del tema actual, permetent que
 * l'AppShell de la Pedra Seca ocupe el 100% de la pantalla, però mantenint
 * wp_head() i wp_footer() per a carregar els scripts i estils.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
	<style>
		/* Forcem l'eliminació de marges i barres de desplaçament del document */
		html, body {
			margin: 0 !important;
			padding: 0 !important;
			width: 100% !important;
			min-height: 100dvh !important;
			background-color: var(--sdp-bg, #f4eee6) !important;
		}
		
		/* Reseteja contenidors del tema per evitar el marge de 12px que posa Sollutia/Gutenberg */
		body > * {
			margin: 0 !important;
			padding: 0 !important;
			max-width: none !important;
		}
		/* Ajust per a la barra d'administració de WordPress */
		body.admin-bar {
			height: calc(100vh - 32px) !important;
			margin-top: 32px !important;
		}
		@media screen and (max-width: 782px) {
			body.admin-bar {
				height: calc(100vh - 46px) !important;
				margin-top: 46px !important;
			}
		}
	</style>
</head>
<body <?php body_class(); ?>>
	<?php wp_body_open(); ?>
	
	<?php
	// Rendim exclusivament el Web Component per evitar injeccions de Gutenberg
	// que podrien trencar l'AppShell PWA.
	if ( function_exists( 'sdp_render' ) ) {
		// Busquem si hi ha un shortcode o bloc per extraure els atributs, si no, cridem amb defectes.
		if ( have_posts() ) {
			while ( have_posts() ) {
				the_post();
				$content = get_the_content();
				if ( has_block( 'socdepoble/portal', $post ) || has_shortcode( $content, 'soc_de_poble' ) ) {
					// Extraiem només el nostre bloc/shortcode de forma segura i ignorem la resta
					$blocks = parse_blocks( $content );
					foreach ( $blocks as $block ) {
						if ( 'socdepoble/portal' === $block['blockName'] ) {
							echo render_block( $block );
							break;
						}
					}
				} else {
					echo sdp_render();
				}
			}
		} else {
			echo sdp_render();
		}
	}
	?>
	<?php wp_footer(); ?>
</body>
</html>

```

