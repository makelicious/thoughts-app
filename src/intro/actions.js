import { submitThought } from 'thoughts/actions';

const demoThoughts = [
  [2500, 'Do laundry []'],
  [5500, '#app-ideas football for hamster'],
  [8000, `#buy
    [] tomato sauce
    [] mozzarella
    [] pineapple
  `],
  [11000, '#movies Mulholland Drive'],
  [14000, '#work remember to compliment Mark']
];

export function initDemo() {
  return (dispatch) => {
    demoThoughts.forEach(([timeout, text]) => {
      setTimeout(() => {
        dispatch(submitThought(text));
      }, timeout);
    });
  };
}
