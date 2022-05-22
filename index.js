const createTab = (url) => {
  return new Promise((resolve) => {
    chrome.tabs.create({ url, active: true, index: 0 }, async (tab) => {
      chrome.tabs.onUpdated.addListener(
        (listener = (tabId, info) => {
          if (info.status === 'complete' && tabId === tab.id) {
            chrome.tabs.onUpdated.removeListener(listener);
            resolve(tab);
          }
        })
      );
    });
  });
};

const activateTab = (index) => {
  chrome.tabs.query({ index }, (tabs) => {
    chrome.tabs.update(tabs[0].id, { highlighted: true });
  });
};

/* const getAppTab = () => {
  return chrome.tabs.query({ index: 0 }, (tabs) => {
    return tabs[0].id;
  });
};

const appTab = getAppTab();

activateTab(0);
chrome.tabs.query({ index: 0 }, (tabs) => {
  chrome.scripting.executeScript({
    target: {
      tabId: tabs[0].id,
    },
    files: ['helpers.js', 'appointment-details.js'],
  });
}); */

createTab('https://visa.vfsglobal.com/tur/en/pol/login').then((tab) => {
  chrome.scripting.executeScript({
    target: {
      tabId: tab.id,
    },
    files: ['credentials.js', 'helpers.js', 'login.js'],
  });

  chrome.runtime.onMessage.addListener((request) => {
    if (request.isLoggedIn) {
      chrome.scripting.executeScript({
        target: {
          tabId: tab.id,
        },
        files: ['dashboard.js'],
      });
    }
    if (request.isBooking) {
      chrome.scripting.executeScript({
        target: {
          tabId: tab.id,
        },
        files: ['appointment-details.js'],
      });
    }
  });
});

/* const getAppTab = async () => {
  return await chrome.tabs.query({ index: 0 }, tabs => {
    return tabs[0].id;
  });
};

const appTab = await getAppTab(); */

/* createTab("https://visa.vfsglobal.com/tur/en/pol/dashboard")
  .then(tab => {
    chrome.scripting.executeScript({
      target: {
        tabId: tab.id
      },
      files: ["dashboard.js"]
    });
}); */
