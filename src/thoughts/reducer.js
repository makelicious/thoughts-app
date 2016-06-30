import { without } from 'lodash';

import { sortByCreatedAt } from 'utils/thought';

import {
  CREATE_THOUGHT,
  SUBMIT_THOUGHT,
  DELETE_THOUGHT,
  MODIFY_THOUGHT,
  SET_SEARCH_TERM,
  SET_EDITABLE,
  SET_BOARD,
  STOP_EDITING,
  ADD_FILTER,
  REMOVE_FILTER,
  RESET_FILTERS,
  THOUGHTS_LOADED
} from 'thoughts/actions';

export function thoughtsReducer(state = [], action) {
  if (action.type === SET_BOARD) {
    return [];
  }

  if (action.type === THOUGHTS_LOADED) {
    return action.payload.sort(sortByCreatedAt);
  }

  if (action.type === SUBMIT_THOUGHT || action.type === CREATE_THOUGHT) {
    return [action.payload].concat(state);
  }

  if (action.type === DELETE_THOUGHT) {
    return without(state, action.payload);
  }

  if (action.type === SET_SEARCH_TERM) {
    return action.payload.sort(sortByCreatedAt);
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
  board: null,
  editableThoughtId: null,
  hashtagFilters: [],
  // Thoughts created or modified while filter view
  // It would probably be weird if they would just disappeared when you delete a tag
  editedWhileFilterOn: []
};

export function editorReducer(state = INITIAL_STATE, action) {
  if (action.type === SET_BOARD) {
    return {
      ...state,
      board: action.payload
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
      editedWhileFilterOn: []
    };
  }

  if (action.type === REMOVE_FILTER) {
    const hashtagFilters = without(state.hashtagFilters, action.payload);

    return {
      ...state,
      hashtagFilters,
      editedWhileFilterOn: hashtagFilters.length === 0 ? [] : state.editedWhileFilterOn
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
