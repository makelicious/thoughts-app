import React from 'react';
import { render } from 'react-dom';

import 'style.css';
import App from 'app';

import 'utils/error-tracking';

const $root = document.getElementById('root');

function getBoardFromHash() {
  const board = location.hash.replace(/#\//, '');

  if(board === '') {
    return null;
  }

  return board;
}

render(<App board={getBoardFromHash()} />, $root);

// Render every time the hash of the users url changes
window.addEventListener('hashchange', () =>
  render(<App board={getBoardFromHash()} />, $root)
, false);
