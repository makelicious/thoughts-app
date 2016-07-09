import { find } from 'lodash';
import { createThought as createThoughtObject } from 'utils/thought';
import {
  updateThought,
  saveThought,
  getThoughts,
  deleteThought
} from 'utils/storage';

// Thought created automatically (in intro for example)
export const SUBMIT_THOUGHT = 'SUBMIT_THOUGHT';

// User creates a thought
export const CREATE_THOUGHT = 'CREATE_THOUGHT';

export const DELETE_THOUGHT = 'DELETE_THOUGHT';
export const MODIFY_THOUGHT = 'MODIFY_THOUGHT';

export const RESET_THOUGHTS = 'RESET_THOUGHTS';
export const LOAD_THOUGHTS = 'LOAD_THOUGHTS';

export const THOUGHTS_LOADING = 'THOUGHTS_LOADING';
export const THOUGHTS_LOADED = 'THOUGHTS_LOADED';

export const SET_SEARCH_TERM = 'SET_SEARCH_TERM';
export const SEARCH_RESULTS_SUCCESS = 'SEARCH_RESULTS_SUCCESS';

export function createThought(text) {
  const newThought = createThoughtObject(text);

  return {
    type: CREATE_THOUGHT,
    payload: newThought
  };
}

export function submitThought(text) {
  const newThought = createThoughtObject(text);

  return {
    type: SUBMIT_THOUGHT,
    payload: newThought
  };
}

function deleteThoughtAction(thought) {
  return (dispatch, getState) => {
    const currentState = getState();
    const { board } = currentState.editor;

    dispatch({
      type: DELETE_THOUGHT,
      payload: thought
    });

    if (board && thought._id !== undefined) {
      deleteThought(board, thought);
    }
  };
}

export { deleteThoughtAction as deleteThought };

export function modifyThought(thought) {
  return {
    type: MODIFY_THOUGHT,
    payload: thought
  };
}

export function setSearchTerm(text) {
  return (dispatch) => {
    dispatch({
      type: SET_SEARCH_TERM,
      payload: text
    });
    if (text.length > 2) {
      dispatch(submitSearch(text));
    }
  };
}

export function clearSearch() {
  return (dispatch) => {
    dispatch({
      type: SET_SEARCH_TERM,
      payload: ''
    });
    dispatch(submitSearch());
  };
}

function submitSearch(searchTerm) {
  return (dispatch, getState) => {
    const state = getState();
    const board = state.editor.board;

    return fetch(`https://evening-oasis-93330.herokuapp.com/${board}/thoughts?search=${searchTerm}`)
    .then((res) => res.json())
    .then((searchResults) => {
      dispatch({
        type: SEARCH_RESULTS_SUCCESS,
        payload: searchResults
      });
    });
  };
}


export function resetThoughts() {
  return {
    type: RESET_THOUGHTS
  };
}

export function loadThoughts() {
  return (dispatch, getState) => {
    const currentState = getState();
    const { board } = currentState.editor;

    if (!board) {
      return;
    }

    dispatch({
      type: THOUGHTS_LOADING
    });

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

export function resetFilters() {
  return {
    type: RESET_FILTERS
  };
}

export function stopEditing(thought) {
  if (thought.text.trim() === '') {
    return deleteThoughtAction(thought);
  }

  return (dispatch, getState) => {
    const currentState = getState();

    dispatch({ type: STOP_EDITING });

    if (!currentState.editor.board) {
      return;
    }

    if (thought._id !== undefined) {
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
