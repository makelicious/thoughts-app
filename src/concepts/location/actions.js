export const SET_BOARD = 'SET_BOARD';

import { loadThoughts } from 'concepts/thoughts/actions';

export function setBoard(board) {
  return (dispatch) => {

    if (board !== null) {
      document.title = board;
    }


    dispatch({
      type: SET_BOARD,
      payload: board
    });

    dispatch(loadThoughts(board));
  };
}
