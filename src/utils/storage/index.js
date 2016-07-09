import * as api from './api';
import * as local from './local-storage';

function selectStorage(board) {
  if (board === 'me') {
    return local;
  }
  return api;
}

function callMethod(methodName, board, ...args) {
  return selectStorage(board)[methodName](board, ...args);
}

export const saveThought = callMethod.bind(null, 'saveThought');
export const getThoughts = callMethod.bind(null, 'getThoughts');
export const deleteThought = callMethod.bind(null, 'deleteThought');
export const updateThought = callMethod.bind(null, 'updateThought');
