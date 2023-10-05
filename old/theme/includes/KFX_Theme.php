<?php
require_once "KFX_Multilang.php";
require_once "KFX_Starter_Api.php";
class KFX_Theme{

  /**
   * Theme constructor
   */
  public function __construct( ) {
    $this->ip = $this->getIp();

    add_theme_support('post-thumbnails');
    add_theme_support('menus');

    $this->ML = new KFX_Multilang();
    if( $this->ML->enabled ){
      //multilanguage enabled
      $this->languages = pll_languages_list( );
    }else{
      $this->languages = [explode('_', get_locale())[0]];
    }

    register_nav_menus(
        array(
          'main_menu' => __('Menu główne', 'kfx_starter_theme'),
          'side_menu' => __('Menu boczne', 'kfx_starter_theme'),
        )
    );

    add_action('wp_enqueue_scripts', [$this, 'load_stylesheets']);

    // Timber
    add_filter('timber/context', [$this, 'add_to_context']);

    // acf
    add_action('acf/init', [$this, 'my_acf_op_init']);
    // uncomment below if global theme
    // add_filter('acf/settings/url', [$this, 'my_acf_settings_url']);
    $this->custom_fields();

    add_action('rest_api_init', function() {
      new KFX_Starter_Api();
    });

    if( !defined( 'DEVELOPMENT' ) ){
      add_filter('acf/settings/show_admin', 'my_acf_settings_show_admin');
      function my_acf_settings_show_admin( $show_admin ) {
          return false;
      }
    }

    add_action('after_setup_theme', [$this, 'load_textdomain']);

  }

  /**
   * Loads theme translations
   */
  public function load_textdomain() {
    load_theme_textdomain('kfx_starter_theme', get_template_directory() . '/languages');
  }

  /**
   * Get user IP
   * @return String $ip IPv4 adress
   */
  public function getIp() {

    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }

    return $ip;
  }

  /**
   * Loads all styles and scripts required by theme
   */
  public function load_stylesheets(){
    wp_register_style('kfx-style', get_template_directory_uri() . '/dist/styles/style.min.css', array(), '1.0.0', 'all');
    wp_enqueue_style('kfx-style');

    if (!is_admin()) {
        wp_deregister_script('jquery');
        wp_deregister_script('jquery-migrate');
    }

    wp_enqueue_script('kfx-theme-script', get_template_directory_uri() . '/dist/scripts/script.min.js', array(), '1.0.0', true);

    wp_localize_script(
      'kfx-theme-script',
      'links',
      array(
        'url' => get_rest_url(),
        'site_link' => get_site_url(),
        'theme_link' => get_template_directory_uri(),
        'ajax' => admin_url( 'admin-ajax.php' )
      )
    );
  }

  /**
   * Add data to Timber context
   */
  public function add_to_context( $context ){

    if( $this->ML->enabled ){
      $lang = pll_current_language( 'slug' );
      $context['language_switcher'] = $this->ML->get_language_switcher();
      $context['multilanguage'] = true;
    }else{
      $lang = $this->languages[0];
    }

    $context['menu'] = new \Timber\Menu('main_menu');
    $context['side_menu'] = new \Timber\Menu('side_menu');
    $context['options'] = get_fields('kfx-starter-settings-'.$lang);
    $context['privacy_policy_url'] = get_privacy_policy_url();
    $context['copyright'] = __('Projekt i realizacja:', 'kfx_starter_theme');

    //below should be placed transatable strings
    $context['strings'] = [

    ];

    if ( function_exists( 'yoast_breadcrumb' ) ) {
      $context['breadcrumbs'] = yoast_breadcrumb('<nav id="breadcrumbs" class="main-breadcrumbs">','</nav>', false );
    }

    $context['aside_sidebar'] = Timber::get_widgets('aside_sidebar');

    return $context;

  }

  /**
   * Register acf options page for each language
   */
  public function my_acf_op_init() {
      foreach($this->languages as $lang){
        // Register options page.
        $option_page = acf_add_options_page(array(
          'page_title'    => sprintf(__('Ustawienia motywu (%s)', 'kfx_starter_theme'), $lang),
          'menu_title'    => sprintf(__('Ustawienia motywu (%s)', 'kfx_starter_theme'), $lang),
          'menu_slug'     => 'kfx-starter-settings-' . $lang,
          'post_id'       => 'kfx-starter-settings-' . $lang,
          'capability'    => 'edit_posts',
          'icon_url'      => 'dashicons-admin-home',
          'redirect'      => false,
        ));
      }

      //uncomment below if activation required
      // $option_page = acf_add_options_page(array(
      //   'page_title'    => __('Aktywacja', 'kfx_starter_theme'),
      //   'menu_title'    => __('Aktywacja', 'kfx_starter_theme'),
      //   'menu_slug'     => 'kfx-sacrum-legacy',
      //   'post_id'       => 'kfx-sacrum-legacy',
      //   'capability'    => 'edit_posts',
      //   'icon_url'      => 'dashicons-admin-home',
      //   'redirect'      => false,
      // ));

  }

  /**
   * Managing ACF path
   */
  public function my_acf_settings_url( $url ) {
    return MY_ACF_URL;
  }

  /**
   * Register sidebars
   */
  public function register_sidebars() {
    register_sidebar( array(
        'name'          => __( 'Pasek boczny', 'kfx_starter_theme' ),
        'id'            => 'aside_sidebar',
        'description'   => __( 'Sidebar widoczny poniżej bocznego menu', 'kfx_starter_theme' ),
        'before_widget' => '<div id="%1$s" class="main-nav-events %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3>',
        'after_title'   => '</h3>',
    ) );
  }

  public function custom_fields() {

    $params = [];
    foreach($this->languages as $lang){
      $params[] = [
        [
          'param' => 'options_page',
          'operator' => '==',
          'value' => 'kfx-sacrum-settings-' . $lang
        ]
      ];
    }

    //put acf below. remember to replace 'location' array with: 'location' => $params,
  }

}

?>
