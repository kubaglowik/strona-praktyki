<?php
/**
 * Template name: Homepage
 * The main template file
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists
 *
 * @package 
 */
if (!\Chisel\Helpers::isTimberActivated()) {
    echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
    return;
}
global $post;
$context = \Timber\Timber::get_context();
$context['post'] = new Timber\Post();
$context['acf'] = get_fields( $post );

Timber::render('templates/front-page.twig', $context);
?>
