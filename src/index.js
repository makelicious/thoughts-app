/* global chrome */

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import { thoughtsReducer, editorReducer } from 'thoughts/reducer';
import introReducer from 'intro/reducer';
import { setBoard } from 'thoughts/actions';
import { getBoardFromHash } from 'utils/url';

import initAnalytics from 'utils/analytics';

import 'style.css';
import 'utils/error-tracking';

import LandingPage from 'containers/landing-page';

const $root = document.getElementById('root');

function isChromeApp() {
  return Boolean(chrome.storage);
}

/*
 * Redux related stuff
 */

const reducers = combineReducers({
  thoughts: thoughtsReducer,
  editor: editorReducer,
  intro: introReducer
});

const store = createStore(
  reducers,
  // By default actions just return an object like { type: X, payload Y}
  // so we cant do anything asynchronous.
  // This middleware allows us to also return functions (see thoughts/actions.js)
  applyMiddleware(thunk)
);


function initApp() {
  return render(
    <Provider store={store}>
      <LandingPage />
    </Provider>,
    $root
  );
}

if (isChromeApp()) {
  chrome.storage.sync.get({
    board: 'me' // default value
  }, (items) => {
    store.dispatch(setBoard(items.board));
    initApp();
  });
} else {
  initAnalytics();

  // Dispatch current board to store
  store.dispatch(setBoard(getBoardFromHash()));

  // Dispatch current board to store every time the hash changes
  window.addEventListener('hashchange', () =>
    store.dispatch(setBoard(getBoardFromHash()))
  , false);

  initApp();
}
