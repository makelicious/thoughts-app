import { MOVE_TO_BOARD } from './actions';
import { SET_BOARD } from 'concepts/location/actions';
import { isChrome, isChromeApp } from 'utils/url';

const INITIAL_STATE = {
  movedToBoard: false,
  canBeInstalledToCurrentBrowser:
    isChrome() && !isChromeApp() && !window.chrome.app.isInstalled,
};

export default function introReducer(state = INITIAL_STATE, action) {
  if (
    action.type === MOVE_TO_BOARD ||
    (action.type === SET_BOARD && action.payload !== null)
  ) {
    return {
      ...state,
      movedToBoard: true,
    };
  }

  return state;
}
