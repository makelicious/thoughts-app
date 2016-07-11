import {
  resetThoughts,
  submitThought
} from 'concepts/thoughts/actions';

import { setBoard } from 'concepts/location/actions';
import DEMO_THOUGHTS from 'data/demo-thoughts';

const CHROME_STORE_URL =
  'https://chrome.google.com/webstore/detail/apcaihkabpnflnpfjnhiekaapeicpion';

export const MOVE_TO_BOARD = 'MOVE_TO_BOARD';

export function initDemo() {
  return (dispatch, getState) => {
    DEMO_THOUGHTS.forEach(([text], i) => {
      setTimeout(() => {
        const { intro } = getState();

        if (!intro.movedToBoard) {
          dispatch(submitThought(text));
        }

      }, (1 + i) * 3500);
    });
  };
}


function moveToBoard() {
  return {
    type: MOVE_TO_BOARD
  };
}

export function goToBoard() {
  return (dispatch) => {
    dispatch(resetThoughts());
    dispatch(moveToBoard());
    setTimeout(() => {
      dispatch(setBoard('me'));
    }, 1000);
  };
}

export function addToChrome() {
  return () => {
    chrome.webstore.install(CHROME_STORE_URL, () => {}, (err) => {
      console.error(err);
    });
  };
}
