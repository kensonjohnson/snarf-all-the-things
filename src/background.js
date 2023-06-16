// Set the text on the badge in the browser extensions bar
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.includes("slack.com")) {
    // Get current state, "ON" or "OFF", for the extension
    const currentState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Simply set to opposite of current state
    const newState = currentState === "ON" ? "OFF" : "ON";

    // Set the action badge to the new state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: newState,
    });
  }
});
