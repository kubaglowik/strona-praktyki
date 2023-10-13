export function slider() {
  let i = 0;
  let images = [];
  let time = 1000;

  let url = window.location.href;

  images[0] = url + 'app/themes/kuba/dist/images/a.jpg';
  images[1] = url + 'app/themes/kuba/dist/images/b.jpg';
  images[2] = url + 'app/themes/kuba/dist/images/c.jpg';

  function changeImg() {
    document.slide.src = images[i];
    if (i < images.lenght - 1) {
      i++;
    } else {
      i = 0;
    }
    setTimeout("changeImg", time);
  }
  window.onload = changeImg;
}
