import { BACKGROUND_LOADED } from './actions';

const INITIAL_STATE = {
  background: false
};

export default function backgroundReducer(state = INITIAL_STATE, action) {
  if (action.type === BACKGROUND_LOADED) {
    return {
      ...state,
      background: action.payload
    };
  }

  return state;
}
