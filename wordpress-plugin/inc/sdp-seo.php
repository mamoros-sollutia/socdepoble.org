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

  $details = '(?:chat|xat|chats|post|page|perfil|gent|empresa|ajuntament|grup|mur|mercat|multimedia|pobles|events|notes)/[a-zA-Z0-9_\\-]+';

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
    // FALLBACK DINÀMIC: Si la ruta no està al manifest estàtic, però és
    // estructuralment vàlida per a l'App, no matem la petició amb un 404.
    // Deixem que l'App carregue i React Router mostre el seu propi 404 o contingut.
    if ( preg_match( '#^(?:' . sdp_route_pattern() . ')$#', $route ) ) {
      $wp_query->is_404 = false;
      status_header( 200 );
      return;
    }

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
  if ( ! is_array( $context ) || empty( $context['index'] ) ) {
    unset( $robots['index'] );
    $robots['noindex'] = true;
    $robots['follow'] = true;
  }
  return $robots;
} );

add_filter( 'wpseo_robots', function ( $robots ) {
  $context = sdp_seo_context();
  return ( ! is_array( $context ) || empty( $context['index'] ) )
    ? 'noindex, follow'
    : $robots;
} );

add_filter( 'rank_math/frontend/robots', function ( $robots ) {
  $context = sdp_seo_context();
  if ( ! is_array( $context ) || empty( $context['index'] ) ) {
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
