// this is the global dictionary that will hold all the values.
var SUPERCART_TAB_ID;
chrome.action.onClicked.addListener(function () {
    chrome.tabs.create(
        { url: "MyCart/index.html" },
        function(tab){
            SUPERCART_TAB_ID = tab.id
        }
    );
});

// refreshing the UI every time a cart is updated
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.refresh_ui_tab === "true")
        chrome.tabs.reload(SUPERCART_TAB_ID);
    }
  );
