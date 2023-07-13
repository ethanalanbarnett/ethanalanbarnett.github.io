class App {
  static body = document.querySelector('body');
  static pageElement = document.querySelector('#page');
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
  }
}

class Tools {
  static resizeHandler() {
    Tools.responsiveHebrewTextAlignment();
    if (App.activeModal) {
      App.activeModal.resize();
    }
  }
  static responsiveHebrewTextAlignment() {
    if (window.innerWidth <= 1042) {
      const aleichem = document.querySelector('#narrow-aleichem');
      const shalom = document.querySelector('#narrow-shalom');
      const aleichemHalfWidth = aleichem.offsetWidth / 2;
      const shalomHalfWidth = shalom.offsetWidth / 2;
      aleichem.style.left = `calc(18% - ${aleichemHalfWidth}px)`;
      shalom.style.right = `calc(18% - ${shalomHalfWidth}px)`;
    }
  }
}

class Page {
  static render() {
    if (this.page !== App.currentPage) {
      App.pageElement.innerHTML = this.content;
      App.currentPage = this.page;
    }
  }
}

class HomePage extends Page {
  static page = 'home';
  static content = `
    <div id="shalom-for-wide-background">
      <h1 id="wide-shalom">שָׁלוֹם עוֹלָם</h1>
      <!-- <p class="subscript">Shalom!</p> -->
    </div>
    <h2>My name is Ethan Alan Barnett</h2>
    <table class="page-bi-table">
      <tr>
        <td class="bi-table-cell title-cell"><h3>Feel free to availe yourself of this cheeky "hello world!" reference:</h3></td>
        <td class="bi-table-cell title-cell"><h3>Alternatively, you may also take a gander at my résumé (click to enlarge):</h3></td>
      </tr>
      <tr>
        <td class="bi-table-cell">
          <iframe id="youtube" src="https://www.youtube-nocookie.com/embed/kqdBD6MMciA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </td>
        <td class="bi-table-cell">
          <a href="javascript:App.modals.résumé.toggle()"><img id="résumé-thumbnail" src="resources/images/Ethan's Résumé.svg" alt="Ethan's Résumé"></a>
        </td>
      </tr>
    </table>
    <p>this is just some text.</p>
  `;
}

class ArchivePage extends Page {
  static page = 'archive';
  static content = `
    <h1>Archive</h1>
  `;
}

class PortfolioPage extends Page {
  static page = 'portfolio';
  static content = `
    <h1>Portfolio</h1>
    <iframe id="portfolio-frame" src="portfolio/bigthicket/app.html" frameborder="0"></iframe>
    <p><a href="portfolio/bigthicket/app.html">Big Thicket Network</a></p>
    <p>This web app is generated with JavaScript into an otherwise empty HTML file. It allows a user to log in and create microblog posts.</p>
  `;
}

class Modal {
  toggle() {    /* add functionality to remove active modal. Also, shift inactive modals to be active */
    if (App.activeModal.modalName === this.modalName) {
      this.element.innerHTML = '';
    } else if (App.inactiveModals.length > 0) {
      for (const modal of inactiveModals) {
        if (modal.modalName === this.modalName) {
          this.element.innerHTML = '';
        }
      }
    } else {
      this.render();
    }
  }
  render() {
    this.element = document.createElement('div');
    this.element.id = this.modalName;
    this.element.className = 'modal';
    App.body.append(this.element);
    this.element.innerHTML = this.content;
    App.activeModal = this;
    this.resize();
    App.screenDimmer.toggle();
    // this.element.addEventListener('click', this.clickHandler.bind(this));
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
    <div class="modal-toolbar">
      <table>
        <tr>
          <td class="modal-toolbar-btn"><a class="nav-link" href="resources/documents/Ethan's Résumé.pdf" target="_blank">Open PDF</a></td>
          <td class="modal-toolbar-xbtn"><a class="nav-link" href="javascript:App.screenDimmer.clickHandler()" download>🗙</a></td>
        </tr>
      </table>
    </div>
    <img id="résumé" src="resources/images/Ethan's Résumé.svg" alt="Ethan's Résumé">
  `;
}

class ScreenDimmer {
  element;
  render() {
    this.element = document.createElement('div');
    this.element.id = 'screen-dimmer';
    this.element.className = 'hidden';
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