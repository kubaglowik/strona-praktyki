<?php
namespace Kodefix\Kuba;

class Multilang
{

  public $enabled;

  public function __construct()
  {
    $this->enabled = function_exists('pll_the_languages');
  }

  public function get_language_switcher()
  {
    if (!$this->enabled) return "";

    $lang = array(
      'dropdown' => false,
      'show_names' => false,
      'show_flags' => true,
      'hide_if_empty' => false,
      'hide_if_not_translation' => false,
      'raw' => true
    );
    $switcher = pll_the_languages($lang);

    $content = '<ul class="language-switcher">';
    $first = '';
    $second = '';

    foreach ($switcher as $lang) {
      if ($lang['current_lang']) {
        $first .= '<li class="single-language current"><a href="' . $lang['url'] . '">' . $lang['flag'] . '</a></li>';
      } else {
        $second .= '<li class="single-language inactive"><a href="' . $lang['url'] . '">' . $lang['flag'] . '</a></li>';
      }
    }

    $content .= $first;
    $content .= $second;
    $content .= '</ul>';

    return $content;
  }
}
