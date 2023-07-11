class App {
  static user = false;
  static element = document.querySelector('body');
  static navBanner;
  static page;
  static screenDimmer;
  static location = 'home';
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
    {username: 'Ethan', password: 'Judges1'},
    {username: 'Eleazar', password: 'Eleazar1'},
    {username: 'zebby', password: 'thetwofeet'}
  ];
  static signInUser(usrnm, pswrd) {
    const navMenuUl = App.navBanner.children[0].children[0];
    const user = new User();
    App.user = user;
    App.user.username = usrnm;
    App.user.password = pswrd;
    navMenuUl.menuButtons[2] = ['Sign out', 'javascript:User.signOutHandler()'];
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
      navMenuUl.menuButtons[2] = ['Sign in', 'javascript:User.signInHandler()'];
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
    tag: 'div',
    className: false,
    id: 'nav-banner',
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
    className: 'nav-menu',
    id: 'nav-menu-main',
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
    tag: 'ul',
    className: 'nav-menu-ul',
    id: false,
    innerHTML: false,
    nextTask: true,
  };
  menuButtons = [
    ['Home', `javascript:App.navigate('home')`],
    ['About', `javascript:App.navigate('about')`],
    ['Sign in', 'javascript:User.signInHandler()'],
    ['Settings', `javascript:App.navigate('settings')`],
    ['Main Site', '/']
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
    className: 'nav-menu-li',
    id: false,
    innerHTML: '',
    nextTask: false,
  };
  constructor(content, href) {
    super();
    this.elementRecipe.innerHTML = `<a class="nav-menu-a" href="${href}">${content}</a>`;
  }
}

class Page extends Element {
  elementRecipe = {
    tag: 'div',
    className: false,
    id: 'main-page',
    innerHTML: false,
    nextTask: true,
  };
  activePage;
  nextTask() {
    const switchBack = this.switchBack();
    if (!switchBack) {
      let pageContent;
      switch (App.location) {
        case 'home':
          pageContent = new Feed();
          break;
        case 'about':
          pageContent = new About();
          break;
        case 'settings':
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

class Feed extends Element {
  elementRecipe = {
    tag: 'div',
    className: false,
    id: 'home',
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
    className: false,
    id: 'feed-controls',
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
    className: 'feed-button',
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
      const noticeModal = new NoticeModal('Notice', 'You must sign in before you can post.', 'OK');
      noticeModal.render(App.element, true);
    }
  }
}

class FeedList extends Element {
  elementRecipe = {
    tag: 'div',
    className: false,
    id: 'feed-list',
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
    tag: 'div',
    className: 'feed-post',
    id: Date.now(),
    innerHTML: '',
    nextTask: false,
  };
  constructor(title, text) {
    super();
    this.elementRecipe.innerHTML = `
      <table>
        <tr><td class="feed-post-user-td"><h2 class="feed-post-user">${App.user.username}</h2></td><td class="feed-post-date-td"><p class="feed-post-date">${Tools.getCurrentDate()}</p></td></tr>
      </table>
      <h3 class="feed-post-title">${title}</h3>
      <div class="feed-post-text">
        <p>${text}</p>
      </div>
    `
  }
}

class About extends Element {
  elementRecipe = {
    tag: 'div',
    className: false,
    id: 'about',
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
    tag: 'div',
    className: false,
    id: 'settings',
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
    className: 'hidden',
    id: 'screen-dimmer',
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
    const xBtn = this.element.querySelector('.modal-x-button');
    xBtn.addEventListener('click', App.screenDimmer.toggle.bind(App.screenDimmer));
    if (this.modalButtons >= 1) {
      const cancelBtn = this.element.querySelector('#modal-cancel-button');
      cancelBtn.addEventListener('click', App.screenDimmer.toggle.bind(App.screenDimmer));
    }
    if (this.modalButtons > 1) {
      const submitBtn = this.element.querySelector('#modal-submit-button');
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
    className: 'modal',
    id: false,
    innerHTML: '',
    nextTask: true
  };
  modalButtons = 1;
  constructor(h2, p, button) {
    super();
    this.elementRecipe.innerHTML = `
      <h2 class="modal-title">${h2}</h2>
      <p>${p}</p>
      <div class="modal-button-wrapper">
        <input class="modal-button" type="button" value="${button}" id="modal-cancel-button">
      </div>
      <button class="modal-x-button">🗙</button>
    `;
  }
}

class SignInModal extends Modal {
  elementRecipe = {
    tag: 'div',
    className: 'modal',
    id: false,
    innerHTML: `
      <h2 class="modal-title">Sign in</h2>
      <form action="" id="sign-in-form">
        <table>
          <tr>
            <td><label for="modal-form-username" class="form-label">Username</label></td>
            <td><input type="text" id="modal-form-username" name="modal-form-username" autofocus></td>
          </tr>
          <tr>
            <td><label for="modal-form-password" class="form-label">Password</label></td>
            <td><input type="password" id="modal-form-password" name="modal-form-password"></td>
          </tr>
        </table>
        <div class="modal-button-wrapper">
          <input class="modal-button" type="button" value="Cancel" id="modal-cancel-button">
          <input class="modal-button" type="button" value="Sign in" id="modal-submit-button">
        </div>
      </form>
      <button class="modal-x-button">🗙</button>
    `,
    nextTask: true,
  };
  modalButtons = 2;
  submitForm() {
    const username = this.element.querySelector('#modal-form-username').value;
    const password = this.element.querySelector('#modal-form-password').value;
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
    className: 'modal',
    id: false,
    innerHTML: `
      <h2 class="modal-title">Add a post to the network</h2>
      <form action="" id="new-post-form">
        <label for="modal-form-title" class="form-label">Title</label>
        <input type="text" id="modal-form-title" name="modal-form-title"><br />
        <label for="modal-form-text" class="form-label" style="display: none">Text</label>
        <textarea name="modal-form-text" id="modal-form-text" form="new-post-form"></textarea><br />
        <label for="modal-form-file" class="form-label">File</label>
        <input type="file" value="Attach File..." id="modal-form-file" name="modal-form-file">
        <div class="modal-button-wrapper">
          <input class="modal-button" type="button" value="Cancel" id="modal-cancel-button">
          <input class="modal-button" type="button" value="Submit" id="modal-submit-button">
        </div>
      </form>
      <button class="modal-x-button">🗙</button>
    `,
    nextTask: true,
  };
  modalButtons = 2;
  submitForm() {
    const title = this.element.querySelector('#modal-form-title').value;
    const text = this.element.querySelector('#modal-form-text').value;
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
