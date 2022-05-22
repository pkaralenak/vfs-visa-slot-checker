waitForElement('app-dashboard').then((app) => {
  app.querySelector('.mat-raised-button').click();
  chrome.runtime.sendMessage({ isLoggedIn: true });
});
