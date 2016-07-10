export const BACKGROUND_LOADED = 'BACKGROUND_LOADED';

import { sample } from 'lodash';

const BACKGROUNDS = [
  'https://images.unsplash.com/photo-1463595373836-6e0b0a8ee322?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=1280&q=80',
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=1823&q=80',
  'https://images.unsplash.com/photo-1452473767141-7c6086eacf42?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=1280&q=80',
  'https://images.unsplash.com/photo-1460378150801-e2c95cb65a50?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=1080&q=80',
  'https://images.unsplash.com/photo-1447834353189-91c48abf20e1?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=1280&q=80',
  'https://images.unsplash.com/photo-1443890484047-5eaa67d1d630?format=auto&auto=compress&dpr=1&crop=entropy&fit=crop&w=1920&h=1280&q=80'
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
