import {
  resetThoughts,
  submitThought
} from 'concepts/thoughts/actions';

export const MOVE_TO_BOARD = 'MOVE_TO_BOARD';

const demoThoughts = [
  [2500, 'Do laundry []'],
  [5500, '#app-ideas football for hamster'],
  [8000, `#buy
    [] tomato sauce
    [] mozzarella
    [] pineapple
  `],
  [11000, '#movies Mulholland Drive'],
  [14000, '#work remember to complement Jonathan']
];

export function initDemo() {
  return (dispatch, getState) => {
    demoThoughts.forEach(([timeout, text]) => {
      setTimeout(() => {
        const { intro } = getState();

        if (!intro.movedToBoard) {
          dispatch(submitThought(text));
        }

      }, timeout);
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
    location.hash = '/me';
    dispatch(resetThoughts());
    dispatch(moveToBoard());
  };
}
