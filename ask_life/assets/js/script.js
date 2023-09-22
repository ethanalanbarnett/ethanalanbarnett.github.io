let burgerMenuOpen = false;

const carouselShowMoreHandler = btn => {
  const p = btn.previousElementSibling;
  p.classList.toggle('services__paragraph-container--clamped');
  if (btn.innerHTML === 'Read More ›') {
    btn.innerHTML = 'Show Less ‹';
  } else {
    btn.innerHTML = 'Read More ›';
  }
}

const hamburgerHandler = btn => {
  const button = document.querySelector('#hamburger-button');
  const menu = button.nextElementSibling;
  menu.classList.toggle('visible-flex');
  menu.classList.toggle('panel');
  menu.classList.toggle('panel--positioned');
  if (burgerMenuOpen) {
    burgerMenuOpen = false;
  } else {
    burgerMenuOpen = true;
    // window.addEventListener('click', checkHamburgerMenu);
  }
}

const checkHamburgerMenu = () => {
  if (burgerMenuOpen) {
    hamburgerHandler();
  }
}