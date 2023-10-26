<?php
/**
 * Patterns Class.
 *
 * @package aquila-features
 */

namespace poradnik_praktyki;

/**
 * Class Patterns.
 */
class Patterns {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->init();
	}

	/**
	 * Initialize plugin
	 */
	private function init() {
		/**
		 * Actions.
		 */
		add_action( 'init', array( $this, 'register_block_patterns' ) );
		add_action( 'init', array( $this, 'register_block_pattern_categories' ) );
	}

	/**
	 * Register Block Patterns.
	 */
	public function register_block_patterns() {
		if ( function_exists( 'register_block_pattern' ) ) {

			// Get the two column pattern content.
			$two_columns_content = aquila_features_get_template( 'patterns/two-columns' );

			/**
			 * Register Two Column Pattern
			 */
			register_block_pattern(
				'aquila-features/two-columns',
				array(
					'title'       => __( 'plugin_praktyki dwie kolumny', 'aquila-features' ),
					'description' => __( 'Aquila Two Column Patterns', 'aquila-features' ),
					'categories'  => array( 'aquila-columns' ),
					'content'     => $two_columns_content,
				)
			);
		}
	}

	/**
	 * Register Block Pattern Categories.
	 */
	public function register_block_pattern_categories() {

		$pattern_categories = array(
			'aquila-columns' => __( 'plugin_praktyki', 'aquila-features' ),
		);

		if ( ! empty( $pattern_categories ) ) {
			foreach ( $pattern_categories as $pattern_category => $pattern_category_label ) {
				register_block_pattern_category(
					$pattern_category,
					array( 'label' => $pattern_category_label )
				);
			}
		}
	}
}
