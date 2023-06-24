removeAllSelectedImages();

async function removeAllSelectedImages() {
  const selectedImages = document.querySelectorAll(".snarfed-image");
  if (selectedImages.length) {
    selectedImages.forEach((image) => {
      console.log(image);
      image.classList.remove("snarfed-image");
    });
  }
  imageSources.clear();
  chrome.storage.session.set({ imageSources: Array.from(imageSources) });
}
