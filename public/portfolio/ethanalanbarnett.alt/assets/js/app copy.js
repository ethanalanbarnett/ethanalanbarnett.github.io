class App {
  static body = document.querySelector('body');
  static pageElement = document.querySelector('main');
  static backgroundsDiv = document.querySelector('#Backgrounds');
  static activePage = false;
  static inactivePages = [];
  static pages = {};
  static activeModal = false;
  static inactiveModals = [];
  static modals = {};
  static screenDimmer;
  static init() {
    this.pages.homePage = new HomePage();
    this.pages.portfolioPage = new PortfolioPage();
    this.pages.archivePage = new ArchivePage();
    Tools.initUriRoute();
    this.modals.résumé = new RésuméModal();
    this.screenDimmer = new ScreenDimmer();
    this.screenDimmer.render();
    Tools.resizeHandler();
    window.addEventListener('popstate', Tools.popState);
    window.addEventListener('resize', Tools.resizeHandler);
    window.onload = Tools.resizeHandler();
  }
}

class Tools {
  static initUriRoute() {
    if (window.location.hash.length < 1) {
      App.pages.homePage.activate();
    } else {
      let uri = window.location.hash.slice(2);
      if (uri[uri.length - 1] === '/') {
        uri = uri.slice(0, -1);
      }
      uri = decodeURIComponent(uri).toLowerCase();
      Tools.pageSwitch(uri);
    }
  }
  static popState() {
    const uri = window.location.pathname.slice(1);
    Tools.pageSwitch(uri, 'no-uri-update');
  }
  static uriUpdate(page) {
    if (page === 'home') {
      history.pushState(null, '', '/');
    } else {
      history.pushState(null, '', page);
    }
  }
  static pageSwitch(uri, option) {
    switch (uri) {
      case 'home': case '':
        App.pages.homePage.activate(option);
        break;
      case 'resume': case 'résumé':
        window.location.href = `https://ethanalanbarnett.github.io/resources/documents/Ethan's Résumé.pdf`;
        break;
      case 'portfolio':
        App.pages.portfolioPage.activate(option);
        break;
      case 'archive':
        App.pages.archivePage.activate(option);
        break;
      default:
        App.pages.notFoundPage = new NotFoundPage(uri);
        App.pages.notFoundPage.activate(option);
    }
  }
  static resizeHandler() {
    if (window.innerWidth <= 1042) {
      Tools.mobileBackgroundAdjustment();
      Tools.hebrewTextAlignment();
    } else {
      Tools.desktopBackgroundAdjustment();
    }
  }
  static desktopBackgroundAdjustment() {
    App.backgroundsDiv.style.height = `${App.pageElement.offsetHeight}px`;
  }
  static mobileBackgroundAdjustment() {
    App.backgroundsDiv.style.height = ''; // this simply removes the custom set height for the element set by the desktopBackgroundAdjustment() function. It does not change the classes.
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
  activate(option) {
    if (!App.activePage) {
      this.render(option);
    } else if (App.activePage.pageName !== this.pageName) {
      App.activePage.element.classList.toggle('hidden');
      App.inactivePages.push(App.activePage);
      let i = 0;
      let found;
      for (const page of App.inactivePages) {
        if (page.pageName === this.pageName) {
          if (option !== 'no-uri-update') {
            Tools.uriUpdate(this.pageName.toLowerCase());
          }
          found = true;
          page.element.classList.toggle('hidden');
          App.activePage = page;
          App.inactivePages.splice(i, 1);
          Tools.resizeHandler();
          break;
        } else {
          found = false;
          i++
        }
      }
      if (!found) {
        this.render(option);
      }
    }
  }
  render(option) {
    if (option !== 'no-uri-update') {
      Tools.uriUpdate(this.pageName.toLowerCase());
    }
    this.element = document.createElement('article');
    this.element.id = `${this.pageName}_Page`;
    this.element.innerHTML = this.content;
    App.pageElement.append(this.element);
    App.activePage = this;
    Tools.resizeHandler();
  }
}

class HomePage extends Page {
  pageName = 'Home';
  element;
  content = `
    <h1 class="desktop-hebrew-txt centered">שָׁלוֹם עוֹלָם</h1>
    <h2 class="main__title centered">My name is Ethan Alan Barnett</h2>
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

class PortfolioPage extends Page {
  pageName = 'Portfolio';
  element;
  content = `
    <h1 class="main__title centered">Portfolio</h1>
    <section class="project">
      <div class="project__itm">
        <h2 class="project__h2"><a class="project__link" href="portfolio/bigthicket/app.html">Big Thicket Network</a></h2>
        <picture>
          <!-- <source srcset="resources/images/big_thicket_network_screenshot.jxl" type="image/jxl">
          <source srcset="resources/images/big_thicket_network_screenshot.webp" type="image/webp"> -->
          <a href="portfolio/bigthicket/app.html">
            <img class="project__img" src="resources/images/big_thicket_network_screenshot.png" alt="Big Thicket Network Screenshot">
          </a>
        </picture>
      </div>
      <div class="project__itm">
        <p class="project__p">This dummy (front-end only) web app is generated with vanilla JavaScript into an otherwise empty HTML boilerplate. It allows a user to log in and create microblog posts. It is written with an object oriented approach (as well as a bad CSS approach: for now).
        <br>Username: Ethan
        <br>Password: Ethan123!</p>
      </div>
    </section>
  `;
}

class ArchivePage extends Page {
  pageName = 'Archive';
  element;
  content = `
    <h1 class="main__title centered">Archive</h1>
  `;
}

class NotFoundPage extends Page {
  pageName = '404';
  element;
  content;
  constructor(uri) {
    super();
    this.content = `
    <h1 class="main__title centered">404 Error</h1>
    <h3 class="centered">There is no page with the name of ${uri}</h3>
  `;
  }
}

class Modal {
  toggle() {
    if (App.activeModal.modalName === this.modalName) {
      this.removeActive();
    } else if (App.inactiveModals.length > 0) {
      this.checkIfInactive();
    } else {
      this.render();
    }
  }
  removeActive() {
    this.element.remove();
    if (App.inactiveModals.length < 1) {
      App.activeModal = false;
      window.location.hash = '';
      history.pushState(null, '', window.location.href.replace('#', ''));
    } else {
      const mostRecentModal = App.inactiveModals.pop();
      App.activeModal = mostRecentModal;
      window.location.hash = App.activeModal.modalName;
    }
  }
  checkIfInactive() {
    let i = 0;
    let found;
    for (const modal of App.inactiveModals) {
      if (modal.modalName === this.modalName) {
        found = true;
        this.element.remove();
        App.inactiveModals.splice(i, 1);
        break;
      } else {
        found = false;
        i++;
      }
    }
    if (!found) {
      this.render();
    }
  }
  render() {
    const modalList = App.body.querySelector('#Modal_List');
    const className = this.modalName.toLowerCase().replace('_', '-').replace("'", '') + '-modal';
    this.element = document.createElement('div');
    this.element.id = this.modalName;
    this.element.className = `modal ${className}`;
    modalList.append(this.element);
    this.element.innerHTML = this.content;
    if (App.activeModal) {
      App.inactiveModals.push(App.activeModal);
    }
    App.activeModal = this;
    Tools.resizeHandler();
    App.screenDimmer.toggle();
    window.location.hash = this.modalName;
  }
}

class RésuméModal extends Modal {
  modalName = "Ethan's_Résumé";
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