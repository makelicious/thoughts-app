import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import {
  thoughtsReducer,
  editorReducer
} from 'thoughts/reducer';

import { setBoard } from 'thoughts/actions';

import 'style.css';
import 'utils/error-tracking';
import 'utils/analytics';

import LandingPage from 'containers/landing-page';

const $root = document.getElementById('root');

function getBoardFromHash() {
  const board = location.hash.replace(/#\//, '');

  if (board === '') {
    return null;
  }

  return board;
}

/*
 * Redux related stuff
 */

const reducers = combineReducers({
  thoughts: thoughtsReducer,
  editor: editorReducer
});

const store = createStore(
  reducers,
  // By default actions just return an object like { type: X, payload Y}
  // so we cant do anything asynchronous.
  // This middleware allows us to also return functions (see thoughts/actions.js)
  applyMiddleware(thunk)
);

// Dispatch current board to store
store.dispatch(setBoard(getBoardFromHash()));

// Dispatch current board to store every time the hash changes
window.addEventListener('hashchange', () =>
  store.dispatch(setBoard(getBoardFromHash()))
, false);

render(
  <Provider store={store}>
    <LandingPage />
  </Provider>,
  $root
);
