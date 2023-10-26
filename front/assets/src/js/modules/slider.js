export function slider() {
  // let i = 0;
  let images = [];
  // let time = 1000;
  let url = window.location.href;
  images[0] = url + 'app/themes/kuba/dist/images/a.jpg';
  images[1] = url + 'app/themes/kuba/dist/images/b.jpg';
  images[2] = url + 'app/themes/kuba/dist/images/c.jpg';


  let currentSlide = 0;
  document.slide.src = images[currentSlide];

  const prev_btn = document.querySelector('.prev');
  const next_btn = document.querySelector('.next');

  prev_btn.addEventListener("click", prevSlide)
  next_btn.addEventListener("click", nextSlide)

  function prevSlide() {
    currentSlide--;
    changeImg()
  }

  function nextSlide() {
    currentSlide++;
    changeImg()
  }

  function changeImg() {
    if (currentSlide > 0 && currentSlide < images.length) {
      document.slide.src = images[currentSlide];
    }
    else {
      currentSlide = 0;
    }
  }

}
