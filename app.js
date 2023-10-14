class App {
  static body = document.querySelector('body');
  static header = document.querySelector('header');
  static main = document.querySelector('main');
  static backgroundsDiv = document.querySelector('#Backgrounds');
  static pages = {};
  static activeModal = false;
  static inactiveModals = [];
  static modals = {};
  static screenDimmer;
  static resize = new ResizeObserver(entries => {
    Tools.resizeHandler();
  });
  static init() {
    Tools.resizeHandler();  // this is just a safety precaution. I don't think it's needed, but just in case a page renders in on mobile and the body does not change size. I'm paranoid.
    App.resize.observe(App.body);
    App.pages.homePage = new HomePage();
    App.pages.portfolioPage = new PortfolioPage();
    App.pages.archivePage = new ArchivePage();
    App.modals.résumé = new RésuméModal();
    App.screenDimmer = new ScreenDimmer();
    App.pages.homePage.render();
    App.pages.portfolioPage.render();
    App.pages.archivePage.render();
    App.screenDimmer.render();
    Tools.initUriRoute();
    window.addEventListener('popstate', Tools.popState);
  }
}

class Tools {
  static initUriRoute() {
    if (window.location.hash.length > 0) {
      const uri = Tools.getUri();
      Tools.pageSwitch(uri);
    }
  }
  static popState() {
    const uri = Tools.getUri();
    if (uri === '404') {
      App.pages.notFoundPage = new NotFoundPage(uri);
      App.pages.notFoundPage.render('404');
    }
    if (uri === `ethan's_résumé` && App.activeModal.modalName !== `Ethan's_Résumé`) {
      App.modals.résumé.toggle();
    }
  }
  static uriUpdate(page) {
    if (page === 'home') {
      history.pushState(null, '', '/');
    } else {
      history.pushState(null, '', page);
    }
  }
  static pageSwitch(hash) {
    if (App.pages.notFoundPage) {
      App.pages.notFoundPage.renav();
      delete App.pages.notFoundPage;
    }
    switch (hash) {
      case 'home': case '':
        document.documentElement.scrollTop = 0;
        if (Tools.getUri('no-decode')) {
          Tools.eraseHash();
        }
        break;
      case 'resume': case 'résumé':
        App.modals.résumé.toggle();
        break;
      case 'portfolio':
        window.location.hash = 'Portfolio';
        break;
      case 'archive':
        window.location.hash = 'Archive';
        break;
      default:
        App.pages.notFoundPage = new NotFoundPage(hash);
        App.pages.notFoundPage.render('404');
    }
  }
  static getUri(option) {
    let uri = window.location.hash.slice(1);
      if (uri[uri.length - 1] === '/') {
        uri = uri.slice(0, -1);
      }
      if (option !== 'no-decode') {
        uri = decodeURIComponent(uri).toLowerCase();
      }
      return uri;
  }
  static eraseHash() {
    const hash = Tools.getUri('no-decode');
    history.pushState(null, '', window.location.href.replace(`#${hash}`, ''));
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
    App.backgroundsDiv.style.height = `${App.main.offsetHeight}px`;
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
  render(option) {
    this.element = document.createElement('article');
    this.element.id = this.pageName;
    this.element.innerHTML = this.content;
    App.main.append(this.element);
    if (option === '404') {
      this.notFound();
    }
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
        <h3 class="greeter__txt">Take a gander at my résumé (click to enlarge):</h3>
        <a href="javascript:App.modals.résumé.toggle()"><img class="greeter__résumé" src="resources/images/Ethan's Résumé.svg" alt="Ethan's Résumé"></a>
      </div>
      <div class="greeter__itm">
        <h3 class="greeter__txt">Alternatively, you may also availe yourself of this cheeky "hello world!" reference:</h3>
        <iframe class="greeter__vid" src="https://www.youtube-nocookie.com/embed/kqdBD6MMciA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>
    </div>
    <br><br>
    <p class="body-txt">This site is obviously rough and unfinished. Its purpose is to display my abilities as I learn front-end web development.
    <br>At the moment, this site is running on vanilla HTML, CSS, and JavaScript: as that is my current focus.</p>
    <h1 class="centered">_________________</h1>
  `;
}

class PortfolioPage extends Page {
  pageName = 'Portfolio';
  element;
  content = `
    <h1 class="main__title centered">Portfolio</h1>
      <section class="project">
        <div class="project__itm">
          <h2 class="project__h2"><a class="project__link" href="https://www.asklife.org/">ASK • Life</a></h2>
          <a href="https://www.asklife.org/">
            <picture>
              <!-- <source srcset="resources/portfolio/images/ask_life_foundation_screenshot.jxl" type="image/jxl"> -->
              <source srcset="resources/images/portfolio/ask_life_foundation_screenshot.avif" type="image/avif">
              <source srcset="resources/images/portfolio/ask_life_foundation_screenshot.webp" type="image/webp">
              <img class="project__img" src="resources/images/portfolio/ask_life_foundation_screenshot.png" alt="ASK • Life Screenshot">
            </picture>
          </a>
        </div>
        <div class="project__itm">
          <p class="project__p">ASK Life Foundation is a private nonprofit that supports projects to educate poor and remote children as well as other charitable causes.
          <br>This site is written in vanilla HTML, CSS, and JavaScript and hosted via Google Firebase.</p>
        </div>
      </section>
      <section class="project">
        <div class="project__itm">
          <h2 class="project__h2"><a class="project__link" href="portfolio/bigthicket/app.html">Big Thicket Network</a></h2>
          <picture>
            <!-- <source srcset="resources/images/big_thicket_network_screenshot.jxl" type="image/jxl">
            <source srcset="resources/images/big_thicket_network_screenshot.webp" type="image/webp"> -->
            <a href="portfolio/bigthicket/app.html">
              <img class="project__img" src="resources/images/portfolio/big_thicket_network_screenshot.png" alt="Big Thicket Network Screenshot">
            </a>
          </picture>
        </div>
        <div class="project__itm">
          <p class="project__p">This dummy (front-end only) web app is generated with vanilla JavaScript into an otherwise empty HTML boilerplate. It allows a user to log in and create microblog posts. It is written with an object oriented approach (as well as a bad CSS approach: for now).
          <br>Username: Ethan
          <br>Password: Ethan123!</p>
        </div>
      </section>
    <h1 class="centered">_________________</h1>
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
  notFound() {
    this.routine(this.pageName);
  }
  renav() {
    this.routine(App.pages.homePage.pageName);
    this.content = '';
  }
  routine(uri) {
    Tools.uriUpdate(uri);
    for (const page in App.pages) {
      if (App.pages[page].pageName !== '404') {
        App.pages[page].element.classList.toggle('hidden');
      }
    }
  }
}

class Modal {
  static xButtonHandler() {
    App.screenDimmer.clickHandler();
    document.documentElement.scrollTop = 0;
  }
  toggle() {
    if (App.activeModal.modalName === this.modalName) {
      this.deactivate();
    } else if (App.inactiveModals.length > 0) {
      this.checkIfInactive();
    } else {
      this.render();
    }
  }
  deactivate() {
    this.element.remove();
    if (App.inactiveModals.length < 1) {
      App.activeModal = false;
      App.header.style.position = ''; // This removes the element level style and reverts back to the CSS.
      Tools.eraseHash();
    } else {
      const mostRecentModal = App.inactiveModals.pop();
      App.activeModal = mostRecentModal;
      window.location.hash = mostRecentModal.modalName;
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
    App.header.style.position = 'static';
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
          <td class="résumé-modal__btn résumé-modal__btn--x"><a class="nav__link symbol" href="javascript:Modal.xButtonHandler()" download>🗙</a></td>
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