import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import thoughtsReducer from 'thoughts/reducer';

import 'style.css';
import 'utils/error-tracking';

import App from 'app';
const $root = document.getElementById('root');

function getBoardFromHash() {
  const board = location.hash.replace(/#\//, '');

  if(board === '') {
    return null;
  }

  return board;
}

/*
 * Redux related stuff
 */
const reducers = combineReducers({
  thoughts: thoughtsReducer
});

const store = createStore(reducers);

render(
  <Provider store={store}>
    <App board={getBoardFromHash()} />
  </Provider>,
  $root
);

// Render every time the hash of the users url changes
window.addEventListener('hashchange', () =>
  render(
    <Provider store={store}>
      <App board={getBoardFromHash()} />
    </Provider>,
    $root
  )
, false);
