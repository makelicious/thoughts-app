import {
  resetThoughts,
  submitThought
} from 'concepts/thoughts/actions';

import { setBoard } from 'concepts/location/actions';

export const MOVE_TO_BOARD = 'MOVE_TO_BOARD';

const demoThoughts = [
  ['#life-goals remember to exercise'],
  ['Do laundry []'],
  ['#app-ideas football for hamster'],
  [`#buy
    [] tomato sauce
    [] mozzarella
    [] pineapple
  `],
  ['#movies Mulholland Drive'],
  ['#life-goals Less thinking, more doing'],
  ['#uni #cs01 assignment due on monday'],
  ['#work remember to complement Jonathan'],
  ['#life-goals read more books'],
  [`#movies #ratings
## The Shawshank Redemption
One of my all time favorites
  `],
  ['#work remember to mark billable hours']
];

export function initDemo() {
  return (dispatch, getState) => {
    demoThoughts.forEach(([text], i) => {
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
    dispatch(setBoard('me'));
    dispatch(resetThoughts());
    dispatch(moveToBoard());
  };
}
