export function getBoardFromHash() {
  const board = location.hash.replace(/#\//, '');
  if (board === '') {
    return null;
  }

  return board;
}

export function isChromeApp() {
  return Boolean(window.chrome && window.chrome.storage);
}
