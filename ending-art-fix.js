// Cache-bust ending artwork so replaced CG files appear immediately on GitHub Pages.
const ENDING_ART_VERSION = 'firelight-female-2';

cgAsset = function(endingNumber) {
  if (!state.playerPresentation || !endingNumber) return null;
  return `assets/ending_${endingNumber}_${state.playerPresentation}.png?v=${ENDING_ART_VERSION}`;
};

galleryCgAsset = function(endingNumber, collection=readEndingCollection()) {
  return `assets/ending_${endingNumber}_${galleryPresentation(collection)}.png?v=${ENDING_ART_VERSION}`;
};
