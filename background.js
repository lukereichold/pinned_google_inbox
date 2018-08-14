let currentTabId;
let calendarTabId;
let previousTab;

function onError(e) {
  console.log("*** Error: " + e);
};

function setButtonIcon(imageURL) {
  try {
    browser.browserAction.setIcon({path: imageURL});
  } catch (e) {
    onError(e);
  }
};

function createPinnedTab() {
  browser.tabs.create({
      url: "https://inbox.google.com",
      pinned: true,
      active: true
    }
  )
};

function handleSearch(calendarTabs) {
  //console.log("currentTabId: " + currentTabId);
  if (calendarTabs.length > 0) {
    //console.log("there is a calendar tab");
    calendarTabId = calendarTabs[0].id;
    if (calendarTabId === currentTabId) {
      //console.log("I'm in the calendar tab");
      browser.tabs.update(previousTab, {active: true,});
    } else {
      //console.log("I'm NOT in the calendar tab");
      previousTab = currentTabId;
      browser.tabs.update(calendarTabId, {active: true,});
    }
    setButtonIcon(calendarTabs[0].favIconUrl);
  } else {
    //console.log("there is NO calendar tab");
    previousTab = currentTabId;
    createPinnedTab();
  }
};

function handleClick(tab) {
  currentTabId = tab.id;
  var querying = browser.tabs.query({url: "*://inbox.google.com/*", currentWindow: true});
  querying.then(handleSearch, onError);
};

function update(details) {
  if (details.reason === "install" || details.reason === "update") {
    var opening = browser.runtime.openOptionsPage();
    opening.then(onOpened, onError);
  }
};

browser.browserAction.onClicked.addListener(handleClick);
browser.runtime.onInstalled.addListener(update);
