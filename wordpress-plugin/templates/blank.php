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
		/*
		 * MARC DE LA PÀGINA (260831, Seient Núm. 5)
		 *
		 * `--sdp-bg` és un token del sistema de disseny i viu dins del shadow
		 * root. Les propietats personalitzades hereten cap avall, així que mai
		 * pot arribar sola fins ací: la puja `_pintaAmfitrio()` des del
		 * component, que la publica sobre `document.documentElement`.
		 *
		 * El fallback d'aquesta declaració NO és una còpia del sistema de
		 * disseny: és el valor d'arrancada, el que es veu durant els
		 * mil·lisegons entre que es pinta l'HTML i s'hidrata el component.
		 * Abans era beix fix, així que qui tenia el telèfon en mode fosc veia
		 * un flaix blanc en cada càrrega. Ara l'arrancada ja respecta la
		 * preferència del sistema i el flaix desapareix.
		 */
		html, body {
			margin: 0 !important;
			padding: 0 !important;
			width: 100% !important;
			min-height: 100dvh !important;
			background-color: var(--sdp-fons-app, #f4eee6) !important;
		}

		@media (prefers-color-scheme: dark) {
			html, body {
				background-color: var(--sdp-fons-app, #0e0d0c) !important;
			}
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
					$rendered = false;
					$blocks = parse_blocks( $content );
					foreach ( $blocks as $block ) {
						if ( 'socdepoble/portal' === $block['blockName'] ) {
							echo render_block( $block );
							$rendered = true;
							break;
						}
					}
					if ( ! $rendered && has_shortcode( $content, 'soc_de_poble' ) ) {
						echo do_shortcode( $content );
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
