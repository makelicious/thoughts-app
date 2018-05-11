import { SET_BOARD } from './actions';

const INITIAL_VALUE = {
  board: null,
};

export default function locationReducer(state = INITIAL_VALUE, action) {
  if (action.type === SET_BOARD) {
    return {
      ...state,
      board: action.payload,
    };
  }
  return state;
}
