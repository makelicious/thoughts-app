document.getElementById('board').addEventListener('keyup', function(event) {
  chrome.storage.sync.set({
    board: event.target.value
  }, function() {
    console.log('Saved');
  });
});

chrome.storage.sync.get({
  board: 'hello'
}, function(items) {
  document.getElementById('board').value = items.board;
});
