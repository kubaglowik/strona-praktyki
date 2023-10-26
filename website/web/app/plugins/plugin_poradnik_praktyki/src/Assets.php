<?php
/**
 * Assets Class.
 *
 * @package aquila-features
 */

namespace poradnik_praktyki;

/**
 * Class Assets.
 */
class Assets {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->init();
	}

	/**
	 * Initialize.
	 */
	private function init() {
		/**
		 * The 'enqueue_block_assets' hook includes styles and scripts both in editor and frontend,
		 * except when is_admin() is used to include them conditionally
		 */
		// var_dump("assets init");
		add_action( 'register_block_type', array( $this, 'enqueue_editor_assets' ) );
		// var_dump("wczytały sie style i skrypty edytora");
	}

	/**
	 * Enqueue Admin Scripts
	 */
	public function enqueue_editor_assets() {

		$asset_config_file = sprintf( '%s/Assets.php', AQUILA_FEATURES_PLUGIN_BUILD_PATH );

		if ( ! file_exists( $asset_config_file ) ) {
			return;
		}

		$asset_config = include_once $asset_config_file;

		if ( empty( $asset_config['js/editor.js'] ) ) {
			return;
		}

		$editor_asset    = $asset_config['js/editor.js'];
		$js_dependencies = ( ! empty( $editor_asset['dependencies'] ) ) ? $editor_asset['dependencies'] : array();
		$version         = ( ! empty( $editor_asset['version'] ) ) ? $editor_asset['version'] : filemtime( $asset_config_file );

		// Theme Gutenberg blocks JS.
		if ( is_admin() ) {
			wp_enqueue_script(
				'af-blocks-js',
				AQUILA_FEATURES_PLUGIN_BUILD_URL . '/js/editor.js',
				$js_dependencies,
				$version,
				true
			);
		}

		// Theme Gutenberg blocks CSS.
		$css_dependencies = array(
			'wp-block-library-theme',
			'wp-block-library',
		);

		wp_enqueue_style(
			'af-blocks-css',
			AQUILA_FEATURES_PLUGIN_BUILD_URL . '/css/editor.css',
			$css_dependencies,
			filemtime( AQUILA_FEATURES_PLUGIN_BUILD_PATH . '/css/editor.css' ),
			'all'
		);
	}
}