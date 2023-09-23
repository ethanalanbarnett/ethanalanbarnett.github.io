const clickCurtain = document.querySelector('#click-curtain');
let burgerMenuOpen = false;

const hamburgerToggle = () => {
  const button = document.querySelector('#hamburger-button');
  const menu = button.nextElementSibling;
  menu.classList.toggle('visible-flex');
  menu.classList.toggle('panel');
  menu.classList.toggle('panel--positioned');
  if (burgerMenuOpen) {
    burgerMenuOpen = false;
  } else {
    burgerMenuOpen = true;
  }
  clickCurtain.classList.toggle('hidden');
}

const hamburgerCheck = () => {
  if (burgerMenuOpen) {
    hamburgerToggle();
  }
}

const hashErase = () => {
  history.pushState(null, '', window.location.href.replace(`#`, ''));
}

const hashCheck = () => {
  let uri = window.location.hash.slice(1);
  if (uri[uri.length - 1] === '/') {
    uri = uri.slice(0, -1);
  }
  if (uri.length === 0) {
    hashErase();
  }
}

const hamburgerHandler = () => {
  hamburgerToggle();
}

const clickCurtainHandler = () => {
  hamburgerCheck();
}

const hashChangeHandler = () => {
  hashCheck();
  hamburgerCheck();
}

const carouselShowMoreHandler = btn => {
  const p = btn.previousElementSibling;
  p.classList.toggle('services__paragraph-container--clamped');
  if (btn.innerHTML === 'Read More ›') {
    btn.innerHTML = 'Show Less ‹';
  } else {
    btn.innerHTML = 'Read More ›';
  }
}

clickCurtain.addEventListener('click', clickCurtainHandler);
window.addEventListener('hashchange', hashChangeHandler);