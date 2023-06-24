document.body.addEventListener("click", handleClick);

if (!imageSources) {
  var imageSources = new Set();
}

function handleClick(e) {
  if (
    e.target &&
    e.target.nodeName === "IMG" &&
    e.target.src.includes("emoji")
  ) {
    if (imageSources.has(e.target.src)) {
      imageSources.delete(e.target.src);
      e.target.classList.remove("snarfed-image");
    } else {
      imageSources.add(e.target.src);
      e.target.classList.add("snarfed-image");
    }

    saveLocal();
  }
}

function saveLocal() {
  chrome.storage.session.set({ imageSources: Array.from(imageSources) });
}

async function recallLocal() {
  const recalledData = await chrome.storage.session.get("imageSources");
  if (Array.isArray(recalledData)) {
    imageSources.clear();
    recalledData.forEach((url) => {
      imageSources.add(url);
    });
  }
}
