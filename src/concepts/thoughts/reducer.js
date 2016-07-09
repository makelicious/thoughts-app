import { without } from 'lodash';

import { getBoardFromHash } from 'utils/url';
import { sortByCreatedAt } from 'utils/thought';

import {
  CREATE_THOUGHT,
  SUBMIT_THOUGHT,
  DELETE_THOUGHT,
  MODIFY_THOUGHT,
  SET_SEARCH_TERM,
  SET_EDITABLE,
  STOP_EDITING,
  ADD_FILTER,
  REMOVE_FILTER,
  RESET_FILTERS,
  SEARCH_RESULTS_SUCCESS,
  RESET_THOUGHTS,
  THOUGHTS_LOADING,
  THOUGHTS_LOADED,
  REQUEST_MORE_THOUGHTS
} from 'concepts/thoughts/actions';

import { SET_BOARD } from 'concepts/location/actions';

export function thoughtsReducer(state = [], action) {
  if (action.type === SET_BOARD || action.type === RESET_THOUGHTS) {
    return [];
  }

  if (action.type === THOUGHTS_LOADED) {
    return action.payload.sort(sortByCreatedAt);
  }

  if (action.type === SEARCH_RESULTS_SUCCESS) {
    return action.payload.sort(sortByCreatedAt);
  }

  if (action.type === SUBMIT_THOUGHT || action.type === CREATE_THOUGHT) {
    return [action.payload].concat(state);
  }

  if (action.type === DELETE_THOUGHT) {
    return without(state, action.payload);
  }

  if (action.type === MODIFY_THOUGHT) {
    return state.map((thought) => {
      if (thought.id === action.payload.id) {
        return action.payload;
      }
      return thought;
    });
  }

  return state;
}

const INITIAL_STATE = {
  board: getBoardFromHash(),
  editableThoughtId: null,
  hashtagFilters: [],
  thoughtsLoading: false,
  currentlyVisibleThoughts: 20,
  // Thoughts created or modified while filter view
  // It would probably be weird if they would just disappeared when you delete a tag
  editedWhileFilterOn: [],
  searchTerm: ''
};

export function editorReducer(state = INITIAL_STATE, action) {

  if (action.type === THOUGHTS_LOADING) {
    return {
      ...state,
      thoughtsLoading: true
    };
  }

  if (action.type === THOUGHTS_LOADED) {
    return {
      ...state,
      thoughtsLoading: false,
      currentlyVisibleThoughts: INITIAL_STATE.currentlyVisibleThoughts
    };
  }

  if (action.type === SET_BOARD) {
    return {
      ...state,
      board: action.payload
    };
  }

  if (action.type === SET_SEARCH_TERM) {
    return {
      ...state,
      searchTerm: action.payload,
      currentlyVisibleThoughts: INITIAL_STATE.currentlyVisibleThoughts
    };
  }

  if (action.type === MODIFY_THOUGHT) {
    if (state.editedWhileFilterOn.indexOf(action.payload.id) > -1 ||
      state.hashtagFilters.length === 0) {
      return state;
    }

    return {
      ...state,
      editedWhileFilterOn: state.editedWhileFilterOn.concat(action.payload.id)
    };
  }

  if (action.type === RESET_FILTERS) {
    return {
      ...state,
      hashtagFilters: [],
      editedWhileFilterOn: [],
      currentlyVisibleThoughts: INITIAL_STATE.currentlyVisibleThoughts
    };
  }

  if (action.type === REQUEST_MORE_THOUGHTS) {
    return {
      ...state,
      currentlyVisibleThoughts: state.currentlyVisibleThoughts + 10
    };
  }

  if (action.type === REMOVE_FILTER) {
    const hashtagFilters = without(state.hashtagFilters, action.payload);

    return {
      ...state,
      hashtagFilters,
      editedWhileFilterOn: hashtagFilters.length === 0 ? [] : state.editedWhileFilterOn,
      currentlyVisibleThoughts: INITIAL_STATE.currentlyVisibleThoughts
    };
  }

  if (action.type === ADD_FILTER) {
    if (state.hashtagFilters.indexOf(action.payload) > -1) {
      return state;
    }

    return {
      ...state,
      hashtagFilters: state.hashtagFilters.concat(action.payload),
      editedWhileFilterOn: []
    };
  }

  if (action.type === DELETE_THOUGHT || action.type === STOP_EDITING) {
    return {
      ...state,
      editableThoughtId: null
    };
  }

  if (action.type === CREATE_THOUGHT || action.type === SET_EDITABLE) {
    return {
      ...state,
      editableThoughtId: action.payload.id
    };
  }

  return state;
}
