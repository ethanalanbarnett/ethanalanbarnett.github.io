const body = document.querySelector('body');
const portfolioDropdown = document.querySelector('#portfolio-dropdown');
const résuméModal = document.querySelector('#résumé-modal');
const screenDimmer = document.querySelector('#screen-dimmer');

const toggleRésumé = () => {
  résuméModal.classList.toggle('hidden');
  if (résuméModal.className !== 'hidden') {
    resizeModal();
    toggleScreenDimmer();
  }
}

const toggleBodyScroll = () => {
  body.classList.toggle('no-scroll');
}

const toggleScreenDimmer = () => {
  screenDimmer.classList.toggle('hidden');
  // toggleBodyScroll();
}

const navDropdownHandler = () => {
  portfolioDropdown.classList.toggle('hidden');
}

const screenDimmerHandler = () => {
  if (résuméModal.className !== 'hidden') {
    toggleRésumé();
  } else {
    toggleScreenDimmer();
  }
}

const nullHandler = () => {}

const resizeModal = () => {
  const halfWidth = résuméModal.offsetWidth / 2;
  résuméModal.style.marginLeft = `calc(50% - ${halfWidth}px)`;  
}

const responsiveHebrewTextAlignment = () => {
  if (window.innerWidth <= 1042) {
    const aleichem = document.querySelector('#narrow-aleichem');
    const shalom = document.querySelector('#narrow-shalom');
    const aleichemHalfWidth = aleichem.offsetWidth / 2;
    const shalomHalfWidth = shalom.offsetWidth / 2;
    aleichem.style.left = `calc(18% - ${aleichemHalfWidth}px)`;
    shalom.style.right = `calc(18% - ${shalomHalfWidth}px)`;
  }
}

screenDimmer.addEventListener('click', screenDimmerHandler);
window.addEventListener('resize', resizeModal);
window.addEventListener('resize', responsiveHebrewTextAlignment);

if (window.innerWidth <= 1042) {
  responsiveHebrewTextAlignment();
}