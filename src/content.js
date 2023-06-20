document.body.addEventListener("click", handleClick);

const imageSources = new Set();

// recallLocal();

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
    console.log("Target: ", e.target);
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
  }
}
