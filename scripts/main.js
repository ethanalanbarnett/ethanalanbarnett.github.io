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

const resizeModal = () => {
  const halfWidth = résuméModal.offsetWidth / 2;
  résuméModal.style.marginLeft = `calc(50% - ${halfWidth}px)`;  
}

screenDimmer.addEventListener('click', screenDimmerHandler);
window.addEventListener('resize', resizeModal);