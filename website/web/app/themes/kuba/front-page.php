<?php

use Timber\Post;
use Timber\Timber;
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

$context = Timber::get_context();
$context['post'] = new Post();
$context['acf'] = get_fields();

$imie = "ala";
$context['jakis'] = $imie;

Timber::render('templates/front-page.twig', $context);
?>
