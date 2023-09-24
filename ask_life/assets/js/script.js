const root = document.querySelector('html');
const clickCurtain = document.querySelector('#click-curtain');
const resize = new ResizeObserver(entries => {
  hamburgerCheck();
});
let burgerMenuOpen = false;

const copyrightYearUpdater = () => {
  const copyrightYear = document.querySelector('#copyright-year');
  const currentYear = new Date().getFullYear();
  copyrightYear.innerHTML = currentYear;
}

const hamburgerToggle = () => {
  const menu = document.querySelector('#main-menu');
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

const hamburgerHandler = () => {
  hamburgerToggle();
}

const clickCurtainHandler = () => {
  hamburgerCheck();
}

const hashChangeHandler = () => {
  hamburgerCheck();
}

const scrollToTopHandler = () => {
  const header = document.querySelector('#header-main');
  const hash = window.location.hash;
  history.pushState(null, '', window.location.href.replace(`${hash}`, ''));
  header.scrollIntoView();
  hamburgerCheck();
}

const carouselShowMoreHandler = btn => {
  const p = btn.previousElementSibling;
  const article = btn.parentElement;
  p.classList.toggle('services__paragraph-container--clamped');
  if (btn.innerHTML === 'Read More ›') {
    btn.innerHTML = 'Show Less ‹';
  } else {
    btn.innerHTML = 'Read More ›';
    article.scrollIntoView({behavior: 'instant'});
  }
}

resize.observe(root);
copyrightYearUpdater();

clickCurtain.addEventListener('click', clickCurtainHandler);
window.addEventListener('hashchange', hashChangeHandler);