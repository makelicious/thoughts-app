export const BACKGROUND_LOADED = 'BACKGROUND_LOADED';

import { sample } from 'lodash';

const BACKGROUNDS = [
  'assets/backgrounds/1443890484047-5eaa67d1d630.jpeg',
  'assets/backgrounds/1447834353189-91c48abf20e1.jpeg',
  'assets/backgrounds/1452473767141-7c6086eacf42.jpeg',
  'assets/backgrounds/1460378150801-e2c95cb65a50.jpeg',
  'assets/backgrounds/1462331940025-496dfbfc7564.jpeg',
  'assets/backgrounds/1463595373836-6e0b0a8ee322.jpeg'
];

export function loadBackground() {
  return (dispatch) => {
    const randomBackground = sample(BACKGROUNDS);

    // Preload image
    const image = new Image();
    image.src = randomBackground;
    image.onload = () => dispatch({
      type: BACKGROUND_LOADED,
      payload: randomBackground
    });
  };
}
