const waitForElement = selector => {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);

    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        const nodes = Array.from(mutation.addedNodes);
        for (let node of nodes) {
          if (node.matches && node.matches(selector)) {
            observer.disconnect();
            resolve(node);
            return;
          }
        };
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
};

const waitForLoading = () => {
  return new Promise((resolve, reject) => {

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' 
          && mutation.attributeName === 'class' 
          && mutation.oldValue === 'ngx-overlay foreground-closing') {
            resolve();
            return;
        }
      });
    });

    observer.observe(
      document.querySelector('.ngx-overlay'), 
      { attributes: true, attributeOldValue: true }
    );
  });
};
