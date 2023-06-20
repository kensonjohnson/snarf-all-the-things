const tab = await getCurrentTab();

const toggle = document.getElementById("toggle");
const counterDisplay = document.getElementById("count");
const downloadButton = document.getElementById("download-button");

toggle.onclick = handleClick;
downloadButton.onclick = downloadList;

getImageList();

chrome.action.getBadgeText({ tabId: tab.id }).then((currentText) => {
  if (currentText === "ON") {
    toggle.checked = true;
  }
});

chrome.storage.session.setAccessLevel({
  accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS",
});

chrome.storage.onChanged.addListener(() => {
  getImageList();
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
  }
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function getImageList() {
  console.log("Inside Recall");
  const { imageSources } = await chrome.storage.session.get("imageSources");
  console.log(imageSources);
  if (imageSources.length) {
    counterDisplay.innerText = imageSources.length;
  }
}

async function downloadList() {
  // create a new handle
  const pickerOpts = {
    suggestedName: "image_sources.txt",
    types: [
      {
        description: "Text File",
        accept: { "text/plain": [".txt"] },
      },
    ],
  };
  const newHandle = await window.showSaveFilePicker();

  // create a FileSystemWritableFileStream to write to
  const writableStream = await newHandle.createWritable();

  // write our file
  const { imageSources } = await chrome.storage.session.get("imageSources");

  imageSources.forEach((srcString) => {
    writableStream.write(srcString + "\n");
  });

  // close the file and write the contents to disk.
  await writableStream.close();
}
