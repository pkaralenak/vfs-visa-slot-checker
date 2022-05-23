const createTab = (url, windowId) => {
  return new Promise((resolve) => {
    chrome.tabs.create({ url, windowId }, async (tab) => {
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

/* const activateTab = (index) => {
  chrome.tabs.query({ index }, (tabs) => {
    chrome.tabs.update(tabs[0].id, { highlighted: true });
  });
};
activateTab(0);

chrome.tabs.query({ index: 0 }, (tabs) => {
  chrome.scripting.executeScript({
    target: {
      tabId: tabs[0].id,
    },
    files: ['config.js', 'helpers.js', 'slot-checker.js'],
  });

  chrome.runtime.onMessage.addListener((request) => {
    if (request.isSlotAvailable) {
      chrome.tabs.update(tabs[0].id, { highlighted: true, active: true });
    }
  });
}); */

const checkSlotInNewTab = (windowId) => {
  createTab('https://visa.vfsglobal.com/tur/en/pol/login', windowId).then(
    (tab) => {
      chrome.scripting.executeScript({
        target: {
          tabId: tab.id,
        },
        files: ['config.js', 'helpers.js', 'slot-checker.js'],
      });

      chrome.runtime.onMessage.addListener((request) => {
        if (request.isSlotAvailable) {
          chrome.tabs.update(tab.id, { highlighted: true, active: true });
        } else {
          setTimeout(() => {
            chrome.tabs.remove(tab.id);
            checkSlotInNewTab(windowId);
          }, 60000);
        }
      });
    }
  );
};

chrome.windows.create({ incognito: true }, (window) =>
  checkSlotInNewTab(window.id)
);
