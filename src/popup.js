const tab = await getCurrentTab();

chrome.storage.session.setAccessLevel({
  accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS",
});

const toggle = document.getElementById("toggle");
const hiddenContainer = document.getElementById("hidden-container");
const counterDisplay = document.getElementById("count");
const downloadButton = document.getElementById("download-button");

toggle.onclick = handleClick;
downloadButton.onclick = convertAndSendFile;

const { imageSources } = await chrome.storage.session.get("imageSources");

updateLinkCount();

chrome.action.getBadgeText({ tabId: tab.id }).then((currentText) => {
  if (currentText === "ON") {
    toggle.checked = true;
  }
});

async function handleClick() {
  const newState = toggle.checked ? "ON" : "";
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: newState,
  });

  if (toggle.checked) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
    chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ["content.css"],
    });
    hiddenContainer.classList.remove("hidden");
  } else {
    chrome.scripting.removeCSS({
      target: { tabId: tab.id },
      files: ["content.css"],
    });
    hiddenContainer.classList.add("hidden");
  }
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function updateLinkCount() {
  if (imageSources) {
    counterDisplay.innerText = imageSources.length ?? 0;
  }
}

async function convertAndSendFile() {
  let content = "";
  const { imageSources } = await chrome.storage.session.get("imageSources");
  imageSources.forEach((imageSRC) => {
    console.log(imageSRC);
    content = content + imageSRC + "\n";
  });
  console.log("Created Content:\n", content);
  const link = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  link.href = URL.createObjectURL(file);
  link.download = "sources.txt";
  link.click();
  URL.revokeObjectURL(link.href);
}
