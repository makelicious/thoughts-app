import { MOVE_TO_BOARD } from './actions';
import { SET_BOARD } from 'thoughts/actions';

const INITIAL_STATE = {
  movedToBoard: false
};

export default function introReducer(state = INITIAL_STATE, action) {
  if (action.type === MOVE_TO_BOARD ||
     (action.type === SET_BOARD && action.payload !== null)) {
    return {
      ...state,
      movedToBoard: true
    };
  }

  return state;
}
