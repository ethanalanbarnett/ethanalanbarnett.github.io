const carouselShowMoreHandler = (btn) => {
  const p = btn.previousElementSibling;
  p.classList.toggle('services__paragraph-container--clamped');
  if (btn.innerHTML === 'Read More ›') {
    btn.innerHTML = 'Show Less ‹';
  } else {
    btn.innerHTML = 'Read More ›';
  }
}