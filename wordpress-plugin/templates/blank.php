<?php
/**
 * Plantilla en blanc per a Sóc de Poble.
 * Elimina la capçalera, el peu i els marges del tema actual, permetent que
 * l'AppShell de la Pedra Seca ocupe el 100% de la pantalla, però mantenint
 * wp_head() i wp_footer() per a carregar els scripts i estils.
 */
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
	// Rendim el contingut de la pàgina on hi haurà el Web Component
	if ( function_exists( 'sdp_es_ruta_react' ) && sdp_es_ruta_react() ) {
		echo sdp_render();
	} else {
		while ( have_posts() ) :
			the_post();
			the_content();
		endwhile;
	}
	?>

	<?php wp_footer(); ?>
</body>
</html>
