export function getBoardFromHash() {
  const board = location.hash.replace(/#\//, '');
  if (board === '') {
    return null;
  }

  return board;
}
