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

	wp_register_script(
		SDP_HANDLE,
		sdp_url( 'dist/soc-de-poble.standalone.js' ),
		array(),
		SDP_VERSIO,
		true
	);
}
add_action( 'init', 'sdp_registrar_actius' );

/** Afig type="module" al script perquè Vite puga fer lazy loading de chunks (ESM). */
add_filter( 'script_loader_tag', function ( $tag, $handle, $src ) {
	if ( SDP_HANDLE === $handle ) {
		return sprintf( "<script type='module' src='%s' id='%s-js'></script>\n", esc_url( $src ), esc_attr( $handle ) );
	}
	return $tag;
}, 10, 3 );

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
