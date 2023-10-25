<?php
/**
 * Plugin Class.
 *
 * @package aquila-features
 */

namespace poradnik_praktyki;

/**
 * Class Plugin.
 */
class Plugin {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->init();
	}

	public function activate() {}

	public function deactivate() {}

	/**
	 * Initialize plugin
	 */
	private function init() {
		// var_dump("klasa plugin dziala");
		define( 'AQUILA_FEATURES_PLUGIN_PATH', untrailingslashit( plugin_dir_path( __DIR__ ) ) );
		define( 'AQUILA_FEATURES_PLUGIN_URL', untrailingslashit( plugin_dir_url( __DIR__ ) ) );
		define( 'AQUILA_FEATURES_PLUGIN_BUILD_PATH', AQUILA_FEATURES_PLUGIN_PATH . '/assets/src/build' );
		define( 'AQUILA_FEATURES_PLUGIN_BUILD_URL', AQUILA_FEATURES_PLUGIN_URL . '/assets/src/build' );
		define( 'AQUILA_FEATURES_PLUGIN_VERSION', '1.0.0' );

		new Assets();
		// var_dump("klasa assets sie wykonala");
		new Patterns();
		// new SearchApi();
	}
}
