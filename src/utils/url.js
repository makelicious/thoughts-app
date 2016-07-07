export function getBoardFromHash() {
  const board = location.hash.replace(/#\//, '');
  if (board === '' || board === 'me') {
    return null;
  }

  return board;
}
