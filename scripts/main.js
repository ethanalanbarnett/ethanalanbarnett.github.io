const body = document.querySelector('body');
const résuméModal = document.querySelector('#résumé-modal');
const screenDimmer = document.querySelector('#screen-dimmer');

const toggleRésumé = () => {
  résuméModal.classList.toggle('hidden');
  if (résuméModal.className !== 'hidden') {
    const halfWidth = résuméModal.offsetWidth / 2;
    résuméModal.style.marginLeft = `calc(50% - ${halfWidth}px)`;
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

const screenDimmerHandler = () => {
  if (résuméModal.className !== 'hidden') {
    toggleRésumé();
  } else {
    toggleScreenDimmer();
  }
}

screenDimmer.addEventListener('click', screenDimmerHandler);