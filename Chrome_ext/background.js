// this is the global dictionary that will hold all the values.
chrome.action.onClicked.addListener(function () {
    chrome.tabs.create({ url: chrome.runtime.getURL("MyCart/index.html") });
});