const logo = document.querySelector('#logo');

const scrollToTop = () => {
  const header = document.querySelector('#header_page');
  const hash = window.location.hash;
  if (hash) {
    history.pushState(null, '', window.location.href.replace(`${hash}`, ''));
  }
  header.scrollIntoView();
}

const rotateLogo = () => {
  logo.classList.toggle('logo-main--spin');
}

const logoClickHandler = () => {
  scrollToTop();
  rotateLogo();
}

logo.addEventListener('click', logoClickHandler);