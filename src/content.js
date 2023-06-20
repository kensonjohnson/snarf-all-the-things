document.body.addEventListener("click", handleClick);

const imageSources = new Set();

recallLocal();

// function addEventListenerToEmojiContainer() {
//   const wrapper = document.querySelector(".p-customize_emoji_wrapper");
//   wrapper.addEventListener("click", handleClick);
// }

function handleClick(e) {
  if (
    e.target &&
    e.target.nodeName === "IMG" &&
    e.target.src.includes("emoji")
  ) {
    imageSources.add(e.target.src);
    console.log("Number of images: ", imageSources.size);
    saveLocal();
  }
}

function saveLocal() {
  chrome.storage.session.set({ imageSources: Array.from(imageSources) });
}

async function recallLocal() {
  const recalledData = await chrome.storage.session.get("imageSources");
  if (Array.isArray(recalledData)) {
    recalledData.forEach((element) => {
      imageSources.add(element);
    });
    console.log("Parsed Size: ", imageSources.size);
  }
}
