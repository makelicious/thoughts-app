import { find } from 'lodash';
import { createThought } from 'utils/thought';
import {
  updateThought,
  saveThought,
  getThoughts
} from 'utils/storage';

export const CREATE_THOUGHT = 'CREATE_THOUGHT';
export const DELETE_THOUGHT = 'DELETE_THOUGHT';
export const MODIFY_THOUGHT = 'MODIFY_THOUGHT';

export const LOAD_THOUGHTS = 'LOAD_THOUGHTS';
export const THOUGHTS_LOADED = 'THOUGHTS_LOADED';

export function addThought(text) {
  const newThought = createThought(text);

  return {
    type: CREATE_THOUGHT,
    payload: newThought
  };
}

export function deleteThought(thought) {
  return {
    type: DELETE_THOUGHT,
    payload: thought
  };
}

export function modifyThought(thought) {
  return {
    type: MODIFY_THOUGHT,
    payload: thought
  };
}

export function loadThoughts() {
  return (dispatch, getState) => {
    const currentState = getState();
    const { board } = currentState.editor;

    if (!board) {
      return;
    }

    getThoughts(board).then((thoughts) =>
      dispatch({
        type: THOUGHTS_LOADED,
        payload: thoughts
      })
    );
  };
}


/*
 * Editing related actions
 */

export const STOP_EDITING = 'STOP_EDITING';
export const SET_EDITABLE = 'SET_EDITABLE';
export const SET_BOARD = 'SET_BOARD';
export const ADD_FILTER = 'ADD_FILTER';
export const REMOVE_FILTER = 'REMOVE_FILTER';
export const RESET_FILTERS = 'RESET_FILTERS';

export function addFilter(filter) {
  return {
    type: ADD_FILTER,
    payload: filter
  };
}

export function removeFilter(filter) {
  return {
    type: REMOVE_FILTER,
    payload: filter
  };
}

export function setEditable(thought) {
  return (dispatch, getState) => {
    const currentState = getState();

    // Something is already being edited
    if (currentState.editor.editableThoughtId) {
      const editableThought = find(currentState.thoughts, {
        id: currentState.editor.editableThoughtId
      });

      dispatch(stopEditing(editableThought));
    }

    dispatch({
      type: SET_EDITABLE,
      payload: thought
    });
  };
}

export function setBoard(board) {
  return (dispatch) => {
    dispatch({
      type: SET_BOARD,
      payload: board
    });

    dispatch(loadThoughts(board));
  };
}

export function resetFilters() {
  return {
    type: RESET_FILTERS
  };
}

export function stopEditing(thought) {
  if (thought.text.trim() === '') {
    return deleteThought(thought);
  }

  return (dispatch, getState) => {
    const currentState = getState();

    dispatch({ type: STOP_EDITING });

    if (!currentState.editor.board) {
      return;
    }

    if (thought._id) {
      updateThought(currentState.editor.board, thought).then((updatedThought) =>
        dispatch(modifyThought(updatedThought))
      );
    } else {
      saveThought(currentState.editor.board, thought).then((updatedThought) =>
        dispatch(modifyThought(updatedThought))
      );
    }
  };
}
