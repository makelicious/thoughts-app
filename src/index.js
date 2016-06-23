import React from 'react';
import requestAnimationFrame from 'raf';
import { render } from 'react-dom';

import 'style.css';
import App from 'app';

import 'utils/error-tracking';

const $root = document.getElementById('root');

function waitUntilStylesLoaded() {
  const height = getComputedStyle($root).getPropertyValue('height');
  if(height === 'auto' || height === '0px') {
    requestAnimationFrame(waitUntilStylesLoaded);
    return;
  }

  render(<App />, $root);
}

waitUntilStylesLoaded();
