<?php
namespace Kodefix\Kuba;

class RestApi extends \WP_REST_CONTROLLER
{

  protected $namespace = 'kfx-starter-theme/v2';

  public function __construct()
  {
    // example route register
    // register_rest_route($this->namespace, 'init', array(
    //   'methods' => 'POST',
    //   'callback' => array($this, 'hello_world'),
    //   'permission_callback' => '__return_true'
    // ));
  }

  // example route callback
  // public function hello_world(\WP_REST_Request $request)
  // {

  //   $data = array();

  //   $data['hello'] = 'world';

  //   return new \WP_REST_Response($data, 200);
  // }
}
