import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import { thoughtsReducer, editorReducer } from 'concepts/thoughts/reducer';
import introReducer from 'concepts/intro/reducer';
import locationReducer from 'concepts/location/reducer';
import { setBoard } from 'concepts/location/actions';
import { getBoardFromHash, isChromeApp } from 'utils/url';

import initAnalytics from 'utils/analytics';

import 'style.css';
import 'utils/error-tracking';

import LandingPage from 'containers/landing-page';

const $root = document.getElementById('root');

/*
 * Redux related stuff
 */

const reducers = combineReducers({
  thoughts: thoughtsReducer,
  editor: editorReducer,
  intro: introReducer,
  location: locationReducer
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
  window.chrome.storage.sync.get({
    board: null
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
