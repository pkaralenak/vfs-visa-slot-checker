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

// checking slots 5 times per hour - at 00, 01, 05, 25 and 45 minutes
const nextCheckRunTime = () => {
  const currentDate = new Date();
  const currentMinute = currentDate.getMinutes();
  const currentHour = currentDate.getHours();
  const currentDay = currentDate.getDate();
  let nextMinute;
  let nextHour = currentHour;
  let nextDay = currentDay;
  if (currentMinute >= 45) {
    nextMinute = 0;
    if (currentHour === 23) {
      nextDay++;
      nextHour = 0;
    } else {
      nextHour++;
    }
  } else if (currentMinute >= 25) {
    nextMinute = 45;
  } else if (currentMinute >= 5) {
    nextMinute = 25;
  } else if (currentMinute >= 2) {
    nextMinute = 5;
  } else {
    nextMinute = 2;
  }
  let nextDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    nextDay,
    nextHour,
    nextMinute
  );
  return (nextDate.getTime() - currentDate.getTime()) / 10;
};

const checkSlotInNewTab = (windowId) => {
  createTab('https://visa.vfsglobal.com/tur/en/pol/login', windowId).then(
    (tab) => {
      chrome.scripting.executeScript({
        target: {
          tabId: tab.id,
        },
        files: ['config.js', 'helpers.js', 'slot-checker.js'],
      });
    }
  );
};

chrome.windows.create({ incognito: true }, (window) => {
  checkSlotInNewTab(window.id);
  chrome.runtime.onMessage.addListener((request, sender) => {
    if (request.isSlotAvailable) {
      chrome.tabs.update(sender.tab.id, { highlighted: true, active: true });
    } else {
      setTimeout(() => {
        chrome.tabs.remove(sender.tab.id);
        checkSlotInNewTab(window.id);
      }, nextCheckRunTime());
    }
  });
});
