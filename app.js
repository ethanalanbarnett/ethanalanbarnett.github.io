class App {
  static body = document.querySelector('body');
  static pageElement = document.querySelector('main');
  static backgroundFrame = document.querySelector('#bgd-frame');
  static currentPage;
  static activeModal = false;
  static inactiveModals = [];
  static modals = {};
  static screenDimmer;
  static init() {
    HomePage.render();
    this.screenDimmer = new ScreenDimmer();
    this.screenDimmer.render();
    this.modals.résumé = new RésuméModal();
    window.addEventListener('resize', Tools.resizeHandler);
    Tools.resizeHandler();
    window.onload = Tools.resizeHandler();
  }
}

class Tools {
  static resizeHandler() {
    if (window.innerWidth <= 1042) {
      Tools.mobileBackgroundAdjustment();
      Tools.hebrewTextAlignment();
    } else {
      Tools.desktopBackgroundAdjustment();
    }
    if (App.activeModal) {
      App.activeModal.resize();
      if (App.inactiveModals.length > 0) {
        for (const modal of App.inactiveModals) {
          modal.resize();
        }
      }
    }
  }
  static desktopBackgroundAdjustment() {
    const bgdLeft = document.querySelector('.bgd-desktop--left');
    const bgdRight = document.querySelector('.bgd-desktop--right');
    App.pageElement.style.minHeight = '';                               /* This simply removes the rule for the specific element, it does not change the rule for the class in CSS. By removeing the element rule, it falls back to the class rule. */
    App.backgroundFrame.style.height = `${App.pageElement.offsetHeight}px`;
    bgdLeft.style.height = `${App.pageElement.offsetHeight}px`;
    bgdRight.style.height = `${App.pageElement.offsetHeight}px`;
  }
  static mobileBackgroundAdjustment() {
    const img = document.querySelector('#bgd-mobile-img');
    const imgHeight = img.offsetHeight;
    App.pageElement.style.minHeight = `calc(100vh - 2.813rem - 5.939rem - ${imgHeight}px)`;
  }
  static hebrewTextAlignment() {
    const olam = document.querySelector('.bgd-mobile__txt--left');
    const shalom = document.querySelector('.bgd-mobile__txt--right');
    const olamHalfWidth = olam.offsetWidth / 2;
    const shalomHalfWidth = shalom.offsetWidth / 2;
    olam.style.left = `calc(18% - ${olamHalfWidth}px)`;
    shalom.style.right = `calc(18% - ${shalomHalfWidth}px)`;
  }
}

class Page {
  static render() {
    if (this.page !== App.currentPage) {
      App.pageElement.innerHTML = this.content;
      App.currentPage = this.page;
      Tools.resizeHandler();
    }
  }
}

class HomePage extends Page {
  static page = 'home';
  static content = `
    <h1 class="desktop-hebrew-txt centered">שָׁלוֹם עוֹלָם</h1>
    <h2 class="centered">My name is Ethan Alan Barnett</h2>
    <div class="greeter">
      <div class="greeter__itm">
        <h3 class="greeter__txt">Feel free to availe yourself of this cheeky "hello world!" reference:</h3>
        <iframe class="greeter__vid" src="https://www.youtube-nocookie.com/embed/kqdBD6MMciA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>
      <div class="greeter__itm">
        <h3 class="greeter__txt">Alternatively, you may also take a gander at my résumé (click to enlarge):</h3>
        <a href="javascript:App.modals.résumé.toggle()"><img class="greeter__résumé" src="resources/images/Ethan's Résumé.svg" alt="Ethan's Résumé"></a>
      </div>
    </div>
    <br><br>
    <p class="body-txt">This site is obviously rough and unfinished (beware the 'Portfolio' page). Its purpose is to display my abilities as I learn front-end web development.
    <br>At the moment, this site is running on vanilla HTML, CSS, and JS: as that is my current focus.</p>
  `;
}

class ArchivePage extends Page {
  static page = 'archive';
  static content = `
    <h1 class="centered">Archive</h1>
  `;
}

class PortfolioPage extends Page {
  static page = 'portfolio';
  static content = `
    <h1 class="centered">Portfolio</h1>
    <article class="project">
      <div class="project__itm">
        <picture>
          <!-- <source srcset="resources/images/big_thicket_network_screenshot.jxl" type="image/jxl">
          <source srcset="resources/images/big_thicket_network_screenshot.webp" type="image/webp"> -->
          <img class="project__img" src="resources/images/big_thicket_network_screenshot.png" alt="Big Thicket Network Screenshot">
        </picture>
      </div>
      <div class="project__itm">
        <h2><a href="portfolio/bigthicket/app.html">Big Thicket Network</a></h2>
        <p>This dummy (front-end only) web app is generated with vanilla JavaScript into an otherwise empty HTML boilerplate. It allows a user to log in and create microblog posts. It is written with an object oriented approach (as well as a bad CSS approach: for now).
        <br>Username: Ethan
        <br>Password: Ethan123!</p>
      </div>
    </article>
  `;
}

class Modal {
  toggle() {
    if (App.activeModal.modalName === this.modalName) {
      this.removeActive();
    } else if (App.inactiveModals.length > 0) {
      this.checkIfInactive();
    } else {
      window.location.href = '#';
      this.render();
    }
  }
  removeActive() {
    this.element.remove();
    App.activeModal = false;
    if (App.inactiveModals.length > 0) {
      const mostRecentModal = App.inactiveModals.pop();
      App.activeModal = mostRecentModal;
    }
  }
  checkIfInactive() {
    let i = 0;
    let found;
    for (const modal of App.inactiveModals) {
      if (modal.modalName === this.modalName) {
        this.element.remove();
        App.inactiveModals.splice(i, 1);
        found = true;
      } else {
        i++;
        found = false;
      }
    }
    if (!found) {
      this.render();
    }
  }
  render() {
    const modalList = App.body.querySelector('#modal-list');
    this.element = document.createElement('div');
    this.element.id = this.modalName;
    this.element.className = `modal ${this.modalName}`;
    modalList.append(this.element);
    this.element.innerHTML = this.content;
    if (App.activeModal) {
      App.inactiveModals.push(App.activeModal);
    }
    App.activeModal = this;
    // this.resize();
    Tools.resizeHandler();
    App.screenDimmer.toggle();
  }
  resize() {
    const halfWidth = this.element.offsetWidth / 2;
    this.element.style.marginLeft = `calc(50% - ${halfWidth}px)`;
  }
}

class RésuméModal extends Modal {
  modalName = 'résumé-modal';
  element;
  content = `
    <nav class="résumé-modal__nav">
      <table>
        <tr>
          <td class="résumé-modal__btn"><a class="nav__link" href="resources/documents/Ethan's Résumé.pdf" target="_blank">Open PDF</a></td>
          <td class="résumé-modal__btn résumé-modal__btn--x"><a class="nav__link symbol" href="javascript:App.screenDimmer.clickHandler()" download>🗙</a></td>
        </tr>
      </table>
    </nav>
    <img class="résumé-modal__img" src="resources/images/Ethan's Résumé.svg" alt="Ethan's Résumé">
  `;
}

class ScreenDimmer {
  element;
  render() {
    this.element = document.createElement('div');
    this.element.className = 'screen-dimmer hidden';
    App.body.append(this.element);
    this.element.addEventListener('click', this.clickHandler.bind(this));
  }
  toggle() {
    this.element.classList.toggle('hidden');
  }
  clickHandler() {
    if (App.activeModal) {
      App.activeModal.toggle();
      this.toggle()
    } else {
      this.toggle();
    }
  }
}

App.init();