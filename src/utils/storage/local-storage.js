import { without } from 'lodash';
const STORAGE_KEY = 'ideahigh_storage';
const INITIAL_DATA = {
  thoughts: []
};

function saveData(data) {
  return window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getData() {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || INITIAL_DATA;
}

export function saveThought(board, thought) {
  const data = getData();

  const thoughtWithId = {
    ...thought,
    _id: data.thoughts.length
  };

  data.thoughts.push(thoughtWithId);

  saveData(data);

  return Promise.resolve(thoughtWithId);
}

export function getThoughts() {
  return Promise.resolve(getData().thoughts);
}

export function deleteThought(board, thought) {
  const data = getData();

  data.thoughts = without(data.thoughts, { id: thought.id });
  saveData(data);
  return Promise.resolve();
}

export function updateThought(board, thought) {
  const data = getData();

  data.thoughts = data.thoughts.map((thou) => {
    if (thought.id === thou.id) {
      return thought;
    }
    return thou;
  });

  saveData(data);

  return Promise.resolve(thought);
}
