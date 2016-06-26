import React from 'react';
import { render } from 'react-dom';

import 'style.css';
import App from 'app';

import 'utils/error-tracking';

const $root = document.getElementById('root');

function getBoardFromHash() {
  return location.hash.replace(/#\//, '');
}

function redirectToDefaultBoard() {
  location.hash = '#/hello';
}

// Use default board if no board is selecteds
if(getBoardFromHash() === '') {
  redirectToDefaultBoard();
}

render(<App board={getBoardFromHash()} />, $root);

// Render every time the hash of the users url changes
window.addEventListener('hashchange', () =>
  render(<App board={getBoardFromHash()} />, $root)
, false);
