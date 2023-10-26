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
		define( 'plugin_praktyki_plugin_path', untrailingslashit( plugin_dir_path( __DIR__ ) ) );
		define( 'plugin_praktyki_plugin_url', untrailingslashit( plugin_dir_url( __DIR__ ) ) );
		define( 'plugin_praktyki_plugin_url_path', plugin_praktyki_plugin_path . '/assets/src/build' );
		define( 'plugin_praktyki_build_url', plugin_praktyki_plugin_url . '/assets/src/build' );
		define( 'plugin_praktyki_plugin_version', '1.0.0' );

		new Assets();
		new Patterns();
		// new SearchApi();
	}
}
