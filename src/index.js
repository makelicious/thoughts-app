import React from 'react';
import requestAnimationFrame from 'raf';
import { render } from 'react-dom';

import 'style.css';
import App from 'app';

import 'utils/error-tracking';

const $root = document.getElementById('root');

function getBoardFromHash() {
  return location.hash.replace(/#\//, '');
}

function afterStylesLoaded(callback) {
  const height = getComputedStyle($root).getPropertyValue('height');
  if(height === 'auto' || height === '0px') {
    requestAnimationFrame(() => afterStylesLoaded(callback));
    return;
  }

  callback();
}

function redirectToDefaultBoard() {
  location.hash = '#/hello';
}

// Use default board if no board is selecteds
if(getBoardFromHash() === '') {
  redirectToDefaultBoard();
}

// Render after styles are loaded
afterStylesLoaded(() =>
  render(<App board={getBoardFromHash()} />, $root)
);

// Render every time the hash of the users url changes
window.addEventListener('hashchange', () =>
  render(<App board={getBoardFromHash()} />, $root)
, false);
