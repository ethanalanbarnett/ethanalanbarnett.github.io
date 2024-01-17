class App {
  static user = false;
  static element = document.querySelector('body');
  static navBanner;
  static page;
  static screenDimmer;
  static location = 'Home';
  static activeModal = false;
  static inactiveModals = [];
  static init() {
    const navBanner = new NavBanner();
    const page = new Page();
    const screenDimmer = new ScreenDimmer();
    this.navBanner = navBanner;
    this.page = page;
    this.screenDimmer = screenDimmer;
    navBanner.render(this.element);
    page.render(this.element);
    screenDimmer.render(this.element);
  }
  static navigate(loc) {
    if (loc === this.location) {
      alert('already here!');
    } else {
      this.location = loc;
      this.page.renavigate();
    }
  }
}

class Tools {
  static getCurrentDate() {
    const currentDate = new Date();
    const currentYear = currentDate.getUTCFullYear().toString();
    let currentMonth = (currentDate.getUTCMonth() + 1).toString();
    let currentDay = currentDate.getUTCDate().toString();
    let currentHour = currentDate.getUTCHours().toString();
    let currentMinute = currentDate.getUTCMinutes().toString();
    let currentSecond = currentDate.getUTCSeconds().toString();
    if (!currentMonth[1]) {
        currentMonth = `0${currentMonth}`;
    };
    if (!currentDay[1]) {
        currentDay = `0${currentDay}`;
    };
    if (!currentHour[1]) {
        currentHour = `0${currentHour}`;
    };
    if (!currentMinute[1]) {
        currentMinute = `0${currentMinute}`;
    };
    if (!currentSecond[1]) {
        currentSecond = `0${currentSecond}`;
    };
    return `${currentYear}.${currentMonth}.${currentDay} | ${currentHour}:${currentMinute}:${currentSecond}`;
  }
}

class User {
  static existingUsers = [
    {username: 'UserOfWebz', password: 'admin1'},
    {username: 'Ethan', password: 'ethan1'}
  ];
  static signInUser(usrnm, pswrd) {
    const navMenuUl = App.navBanner.children[0].children[0];
    const user = new User();
    App.user = user;
    App.user.username = usrnm;
    App.user.password = pswrd;
    navMenuUl.menuButtons[3] = ['Sign out', 'javascript:User.signOutHandler()'];
    navMenuUl.nextTask();
    App.screenDimmer.toggle();
  }
  static signInHandler() {
    if (!App.user) {
      const signInModal = new SignInModal();
      signInModal.render(App.element, true);
    }
  }
  static signOutHandler() {
    if (App.user) {
      App.user = false;
      const navMenuUl = App.navBanner.children[0].children[0];
      navMenuUl.menuButtons[3] = ['Sign in', 'javascript:User.signInHandler()'];
      navMenuUl.nextTask();
    }
  }
  static checkCredentials(usrnm, pswrd) {
    for (const user of this.existingUsers) {
      if (usrnm === user.username && pswrd === user.password) {
        this.signInUser(usrnm, pswrd);
        break;
      }
    }
    if (!App.user) {
      const noticeModal = new NoticeModal('Notice', 'Wrong username or password.', 'OK');
      noticeModal.render(App.element);
    }
  }
}



class Element {
  children = [];
  render(root, dimmer, ...others) {
    this.element = document.createElement(this.elementRecipe.tag);
    if (root) {
      root.append(this.element);
    }
    if (dimmer) {
      App.screenDimmer.toggle();
    }
    if (this.elementRecipe.className) {
      this.element.className = this.elementRecipe.className;
    }
    if (this.elementRecipe.id) {
      this.element.id = this.elementRecipe.id;
    }
    if (this.elementRecipe.innerHTML) {
      this.element.innerHTML = this.elementRecipe.innerHTML;
    }
    if (this.elementRecipe.nextTask) {
      this.nextTask(...others);
    } else {
      return this.element;
    }
  }
}

class NavBanner extends Element {
  elementRecipe = {
    tag: 'header',
    className: 'header-main card card--bubble card--dark',
    id: 'Header_Main',
    innerHTML: false,
    nextTask: true,
  };
  nextTask() {
    const navMenu = new NavMenu();
    this.children.push(navMenu);
    navMenu.render(this.element);
  }
}

class NavMenu extends Element {
  elementRecipe = {
    tag: 'nav',
    className: 'nav-main',
    id: 'Nav_Main',
    innerHTML: false,
    nextTask: true,
  };
  nextTask() {
    const navMenuUl = new NavMenuUl();
    this.children.push(navMenuUl);
    navMenuUl.render(this.element);
  }
}

class NavMenuUl extends Element {
  elementRecipe = {
    tag: 'menu',
    className: 'nav-main__menu flex flex--double-gap',
    id: false,
    innerHTML: false,
    nextTask: true,
  };
  menuButtons = [
    ['Home', `javascript:App.navigate('Home')`],
    ['About', `javascript:App.navigate('About')`],
    ['Settings', `javascript:App.navigate('Settings')`],
    ['Sign in', 'javascript:User.signInHandler()']
  ];
  nextTask() {
    if (this.children[0]) {
      this.element.innerHTML = '';
      this.children = [];
    }
    for (const menuButton of this.menuButtons) {
      const [content, href] = menuButton;
      const navMenuButton = new NavMenuButton(content, href);
      this.children.push(navMenuButton);
      navMenuButton.render(this.element);
    }
  }
}

class NavMenuButton extends Element {
  elementRecipe = {
    tag: 'li',
    className: 'nav-main__li',
    id: false,
    innerHTML: '',
    nextTask: false,
  };
  constructor(content, href) {
    super();
    this.elementRecipe.innerHTML = `<a class="nav-main__a" href="${href}">${content}</a>`;
  }
}

class Page extends Element {
  elementRecipe = {
    tag: 'main',
    className: 'page-main',
    id: 'Page_Main',
    innerHTML: false,
    nextTask: true,
  };
  activePage;
  nextTask() {
    const switchBack = this.switchBack();
    if (!switchBack) {
      let pageContent;
      switch (App.location) {
        case 'Home':
          pageContent = new Home();
          break;
        case 'About':
          pageContent = new About();
          break;
        case 'Settings':
          pageContent = new Settings();
      }
      this.children.push(pageContent);
      this.activePage = pageContent;
      pageContent.render(this.element);
    }
  }
  switchBack() {
    if (this.children[0]) {
      for (const child of this.children) {
        if (child.element.id === App.location) {
          this.activePage = child;
        }
      }
      if (this.activePage.element.id === App.location) {
        this.activePage.element.classList.toggle('hidden');
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  renavigate() {
    this.activePage.element.classList.toggle('hidden');
    this.nextTask();
  }
}

class Home extends Element {
  elementRecipe = {
    tag: 'section',
    className: 'feed flex flex--column',
    id: 'Home',
    innerHTML: false,
    nextTask: true,
  };
  nextTask() {
    const feedControls = new FeedControls();
    const feedList = new FeedList();
    this.children.push(feedControls, feedList);
    feedControls.render(this.element);
    feedList.render(this.element);
  }
}

class FeedControls extends Element {
  elementRecipe = {
    tag: 'div',
    className: 'feed__controls card card--bubble',
    id: 'Feed_Controls',
    innerHTML: false,
    nextTask: true,
  };
  nextTask() {
    const newPostBtn = new NewPostBtn();
    this.children.push(newPostBtn);
    newPostBtn.render(this.element);
  }
}

class NewPostBtn extends Element {
  elementRecipe = {
    tag: 'button',
    className: 'feed__button',
    id: false,
    innerHTML: 'New post',
    nextTask: true,
  };
  nextTask() {
    this.element.addEventListener('click', this.clicked.bind(this));
  }
  clicked() {
    if (App.user) {
      const newPostModal = new NewPostModal();
      newPostModal.render(App.element, true);
    } else {
      const noticeModal = new NoticeModal('Notice', "You must sign in before you can post.<br /><br />*psst!*<br /><br />Username: UserOfWebz<br />Password: admin1<br /><br />(This baby's secure as Fort Knox)", 'OK');
      noticeModal.render(App.element, true);
    }
  }
}

class FeedList extends Element {
  elementRecipe = {
    tag: 'div',
    className: 'feed__list flex flex--column',
    id: 'Feed_List',
    innerHTML: false,
    nextTask: true,
  };
  nextTask() {
    if (this.children[0]) {
      this.element.innerHTML = '';
      for (const post of this.children) {
        post.render(this.element);
      }
    }
  }
}

class FeedPost extends Element {
  elementRecipe = {
    tag: 'article',
    className: 'feed__post card card--bubble',
    id: Date.now(),
    innerHTML: '',
    nextTask: false,
  };
  constructor(title, text) {
    super();
    this.elementRecipe.innerHTML = `
      <div class="feed__user-date flex">
        <h2 class="feed__user">${App.user.username}</h2>
        <p class="feed__date">${Tools.getCurrentDate()}</p>
      </div>
      <h3 class="feed__title">${title}</h3>
      <p class="feed__text">${text}</p>
    `
  }
}

class About extends Element {
  elementRecipe = {
    tag: 'section',
    className: 'about flex flex--column',
    id: 'About',
    innerHTML: false,
    nextTask: true,
  };
  nextTask() {
    // const feedControls = new FeedControls();
    // const feedList = new FeedList();
    // this.children.push(feedControls, feedList);
    // feedControls.render(this.element);
    // feedList.render(this.element);
  }
}

class Settings extends Element {
  elementRecipe = {
    tag: 'section',
    className: 'settings flex flex--column',
    id: 'Settings',
    innerHTML: false,
    nextTask: true,
  };
  nextTask() {
    // const feedControls = new FeedControls();
    // const feedList = new FeedList();
    // this.children.push(feedControls, feedList);
    // feedControls.render(this.element);
    // feedList.render(this.element);
  }
}

class ScreenDimmer extends Element {
  elementRecipe = {
    tag: 'div',
    className: 'screen-dimmer hidden',
    id: 'Screen_Dimmer',
    innerHTML: false,
    nextTask: true,
  };
  nextTask() {
    this.element.addEventListener('click', this.toggle.bind(this));
  }
  toggle() {
    if (!App.inactiveModals[0]) {
      this.element.classList.toggle('hidden');
    }
    Modal.removeActiveModal();
  }
}



class Modal extends Element {
  static removeActiveModal() {
    if (App.activeModal) {
      App.activeModal.element.remove();
      if (App.inactiveModals[0]) {
        const lastModal = App.inactiveModals.length - 1;
        App.activeModal = App.inactiveModals[lastModal];
        App.inactiveModals.pop();
        App.activeModal.element.style.zIndex = 1;
        App.activeModal.focusInput();
      } else {
        App.activeModal = false;
      }
    }
  }
  makeActiveModal() {
    if (App.activeModal) {
      App.activeModal.element.style.zIndex = 0;
      App.inactiveModals.push(App.activeModal);
      App.activeModal = this;
      App.activeModal.element.style.marginTop = '30px';
    } else {
      App.activeModal = this;
    }
  }
  horizontalAlignModal() {
    const halfWidth = this.element.offsetWidth / 2;
    this.element.style.marginLeft = `calc(50% - ${halfWidth}px)`;
  }
  addButtonListeners() {
    const inputs = this.element.querySelectorAll('input');
    const xBtn = this.element.querySelector('.modal__button-x');
    xBtn.addEventListener('click', App.screenDimmer.toggle.bind(App.screenDimmer));
    if (this.modalButtons >= 1) {
      const cancelBtn = this.element.querySelector('#Modal_Cancel_Button');
      cancelBtn.addEventListener('click', App.screenDimmer.toggle.bind(App.screenDimmer));
    }
    if (this.modalButtons > 1) {
      const submitBtn = this.element.querySelector('#Modal_Submit_Button');
      submitBtn.addEventListener('click', this.submitForm.bind(this));
    }
    if (inputs.length > 0) {
      for (const input of inputs) {
        if (input.type === 'text' || input.type === 'password') {
          input.addEventListener('keypress', event => {
            if (event.key === 'Enter') {
              event.preventDefault();
              this.submitForm();
            }
          });
        }
      }
    }
  }
  focusInput() {
    const firstInput = this.element.querySelector('input');
    firstInput.focus();
  }
  nextTask() {
    this.makeActiveModal();
    this.horizontalAlignModal();
    this.addButtonListeners();
    this.focusInput();
  }
}

class NoticeModal extends Modal {
  elementRecipe = {
    tag: 'div',
    className: 'modal card',
    id: false,
    innerHTML: '',
    nextTask: true
  };
  modalButtons = 1;
  constructor(h2, p, button) {
    super();
    this.elementRecipe.innerHTML = `
      <h2 class="modal__title">${h2}</h2>
      <p>${p}</p>
      <div class="modal__button-wrapper">
        <input class="modal__button" type="button" value="${button}" id="Modal_Cancel_Button">
      </div>
      <button class="modal__button-x">🗙</button>
    `;
  }
}

class SignInModal extends Modal {
  elementRecipe = {
    tag: 'div',
    className: 'modal card',
    id: false,
    innerHTML: `
      <h2 class="modal__title">Sign in</h2>
      <form action="" id="Sign_In_Form">
        <table>
          <tr>
            <td><label for="Modal_Form_Username" class="form__label">Username</label></td>
            <td><input type="text" id="Modal_Form_Username" name="Modal_Form_Username" autofocus></td>
          </tr>
          <tr>
            <td><label for="Modal_Form_Password" class="form__label">Password</label></td>
            <td><input type="password" id="Modal_Form_Password" name="Modal_Form_Password"></td>
          </tr>
        </table>
        <div class="modal__button-wrapper">
          <input class="modal__button" type="button" value="Cancel" id="Modal_Cancel_Button">
          <input class="modal__button" type="button" value="Sign in" id="Modal_Submit_Button">
        </div>
      </form>
      <button class="modal__button-x">🗙</button>
    `,
    nextTask: true,
  };
  modalButtons = 2;
  submitForm() {
    const username = this.element.querySelector('#Modal_Form_Username').value;
    const password = this.element.querySelector('#Modal_Form_Password').value;
    if (!username.trim() && !password) {
      const noticeModal = new NoticeModal('Notice', 'The username and password are blank; they need to be filled.', 'OK');
      noticeModal.render(App.element);
    } else if (!username.trim()) {
      const noticeModal = new NoticeModal('Notice', 'The username is blank; it needs to be filled.', 'OK');
      noticeModal.render(App.element);
    } else if (!password) {
      const noticeModal = new NoticeModal('Notice', 'The password is blank; it needs to be filled.', 'OK');
      noticeModal.render(App.element);
    } else if (username.trim() && password) {
      User.checkCredentials(username, password);
    }
  }
}

class NewPostModal extends Modal {
  elementRecipe = {
    tag: 'div',
    className: 'modal card',
    id: false,
    innerHTML: `
      <h2 class="modal__title">Add a post to the network</h2>
      <form action="" id="New_Post_Form">
        <label for="Modal_Form_Title" class="form__label">Title</label>
        <input type="text" id="Modal_Form_Title" name="Modal_Form_Title" class="modal__form-title"><br />
        <label for="Modal_Form_Text" class="form__label" style="display: none">Text</label>
        <textarea name="Modal_Form_Text" id="Modal_Form_Text" class="modal__form-text" form="New_Post_Form"></textarea><br />
        <div class="modal__button-wrapper">
          <input class="modal__button" type="button" value="Cancel" id="Modal_Cancel_Button">
          <input class="modal__button" type="button" value="Submit" id="Modal_Submit_Button">
        </div>
      </form>
      <button class="modal__button-x">🗙</button>
    `,
    nextTask: true,
  };
  modalButtons = 2;
  submitForm() {
    const title = this.element.querySelector('#Modal_Form_Title').value;
    const text = this.element.querySelector('#Modal_Form_Text').value;
    if (!title.trim() && !text.trim()) {
      const noticeModal = new NoticeModal('Notice', 'The title and body are blank; they need to be filled.', 'OK');
      noticeModal.render(App.element);
    } else if (!title.trim()) {
      const noticeModal = new NoticeModal('Notice', 'The title is blank; it needs to be filled.', 'OK');
      noticeModal.render(App.element);
    } else if (!text.trim()) {
      const noticeModal = new NoticeModal('Notice', 'The body is empty; it needs to be filled.', 'OK');
      noticeModal.render(App.element);
    } else if (title.trim() && text.trim()) {
      const feedPost = new FeedPost(title, text);
      App.page.children[0].children[1].children.unshift(feedPost);
      App.page.children[0].children[1].nextTask();
      App.screenDimmer.toggle();
    }
  }
}

App.init();
