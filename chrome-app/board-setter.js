chrome.storage.sync.get({
  board: 'hello'
}, function(items) {
  console.log('/#/' + items.board, items.board);
  location.hash = '/' + items.board;
});
