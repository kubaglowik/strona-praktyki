<?php

/**
 * Aquila poradnik_praktyki
 *
 * @package aquila-features
 * @author  kubaglowik
 *
 * @wordpress-plugin
 * Plugin Name:       poradnik_praktyki
 * Plugin URI:        https://example.com/plugins/the-basics/
 * Description:       plugin Description
 * Version:           1.0.0
 * Requires at least: 5.2
 * Requires PHP:      7.2
 * Author:            @kubaglowik
 * Author URI:        https://author.example.com/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Update URI:        https://example.com/my-plugin/
 * Text Domain:       poradnik_praktyki
 * Domain Path:       /languages
 */

/**
 * Bootstrap the plugin.
 */

namespace poradnik_praktyki;

require_once 'vendor/autoload.php';
require_once untrailingslashit( plugin_dir_path( __FILE__ ) ) . '/assets/src/inc/custom-functions.php';

use poradnik_praktyki\Plugin;

if ( class_exists( 'poradnik_praktyki\Plugin' ) ) {
	$the_plugin = new Plugin();
}

register_activation_hook( __FILE__, array( $the_plugin, 'activate' ) );

register_deactivation_hook( __FILE__, array( $the_plugin, 'deactivate' ) );
