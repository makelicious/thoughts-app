const STORAGE_KEY = 'thoughts_app';

function getData(argument) {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {
    thoughts: []
  };
}

function saveData(data) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function saveThoughts(thoughts) {
  const data = getData();
  data.thoughts = thoughts;
  saveData(data);
}

export function getThoughts() {
  return getData().thoughts;
}
