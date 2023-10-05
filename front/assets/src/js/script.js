/**
 * SASS
 */
import '../sass/layout.scss';

/**
 * JavaScript
 */

/**
 * Add here your JavasScript code
 */

  var i = 0;
  var images = [];
  var time = 1000;

  var url = window.location.href;

  images[0] = url + 'app/themes/kuba/dist/images/a.jpg';
  images[1] = url + 'app/themes/kuba/dist/images/b.jpg';
  images[2] = url + 'app/themes/kuba/dist/images/c.jpg';

  function changeimg() {
    document.slide.src = images[i];
  if(i < images.lenght - 1){
    i++;
  }else{
    i = 0;
  }
    setTimeout("changeimg()",time);
  }
  window.onload = changeimg;
