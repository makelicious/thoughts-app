/* global chrome */
chrome.storage.sync.get({
  board: null
// eslint-disable-next-line prefer-arrow-callback
}, function setHash(items) {
  if (items.board) {
    location.hash = `/${items.board}`;
  }
});
