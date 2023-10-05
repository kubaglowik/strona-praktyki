<?php

class KFX_Starter_Api extends WP_REST_CONTROLLER {

  protected $namespace = 'kfx-starter-theme/v2';

  public function __construct() {

    register_rest_route( $this->namespace, 'init', array(
      'methods' => 'POST',
      'callback' => array( $this, 'hello_world'),
      'permission_callback' => '__return_true'
    ));

  }

  public function hello_world( $request ) {

    $data = array();

    $data['hello'] = 'world';

    return new WP_REST_Response( $data, 200 );

  }

}
?>
