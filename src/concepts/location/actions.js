export const SET_BOARD = 'SET_BOARD';

import { loadThoughts } from 'concepts/thoughts/actions';
import { isChromeApp } from 'utils/url';

function setBrowserState(board) {
  if (isChromeApp()) {
    chrome.storage.sync.set({ board });
  } else {
    const nextHash = `/${board}`;

    if (board !== null && location.hash.replace('#', '') !== nextHash) {
      location.hash = nextHash;
    }
  }
}

export function setBoard(board) {
  return (dispatch) => {

    if (board !== null) {
      document.title = board;
    }

    setBrowserState(board);

    dispatch({
      type: SET_BOARD,
      payload: board
    });

    dispatch(loadThoughts(board));
  };
}
