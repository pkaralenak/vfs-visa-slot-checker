
  waitForElement('app-login').then(app => {
    const emailInput = app.querySelector('#mat-input-0');
    const passwordInput = app.querySelector('#mat-input-1');
    emailInput.value = email;
    passwordInput.value = password;
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
    app.querySelector('.mat-raised-button').click();
    chrome.runtime.sendMessage({ isLoggedIn:  true });
  });

