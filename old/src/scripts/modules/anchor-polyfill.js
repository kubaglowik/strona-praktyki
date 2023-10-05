import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

/** Class with AchorLinks polyfill */
export default class AnchorPolyfill {

  /**
   * constructor
   * @param {number} menuHeight - optional parameter with height in pixels of fixed navbar - required to calculate valid scroll position on anchor link
   */
  constructor( menuHeight = 0 ){

    if(window.location.hash) {
      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 1);
      window.addEventListener('load', () => {

        setTimeout( () => {
          let anchor = document.querySelector( window.location.hash );
          let cords = anchor.getBoundingClientRect();
          window.scroll({
            top: cords.top + window.scrollY - menuHeight - 30,
            left: window.scrollX,
            behavior: 'smooth'
          });
        }, 300);

      });

    }

    //get all links
    const links = document.querySelectorAll('a');

    links.forEach( link => {
      link.addEventListener('click', e => {
        if( link.getAttribute('href').indexOf('#') === -1 ) return;
        let anchorLink = link.getAttribute('href').split('#')[1];
        if( !document.querySelector( `#${anchorLink}` ) ) return;
        e.preventDefault();

        //anchor exists, let's do some magic
        let anchor = document.querySelector( `#${anchorLink}` );
        let cords = anchor.getBoundingClientRect();

        window.scroll({
          top: cords.top + window.scrollY - menuHeight,
          left: window.scrollX,
          behavior: 'smooth'
        });
      })
    })

  }

}
