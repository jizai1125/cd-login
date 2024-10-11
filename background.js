chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "login") {
    login();
  }
});
function login() {
  chrome.storage.local.get(["address", "username", "password"], (res) => {
    let url = res.address;
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      const currentTab = tabs[0];
      if (currentTab?.url === url) {
        _runLoginScript(currentTab);
      } else {
        chrome.tabs.create({ url }, (tab) => {
          chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
            if (info.status === "complete" && tabId === tab.id) {
              _runLoginScript(tab);
              chrome.tabs.onUpdated.removeListener(listener);
            }
          });
        });
      }
    });
    function _runLoginScript(tab) {
      let username = res.username;
      let password = res.password;
      chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        func: (username, password) => {
          const iframe = document.getElementById("leftFrame");
          const form = iframe.contentDocument.querySelector("#LoginForm");
          const usernameInput = form.querySelector('[name="username"]');
          const passwordInput = form.querySelector('[name="password"]');
          usernameInput.value = username;
          passwordInput.value = password;
          setTimeout(() => {
            form.submit();
          }, 300);
        },
        args: [username, password],
      });
    }
  });
}
