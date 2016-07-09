import { isChromeApp } from 'utils/url';

const STORAGE_KEY = 'ideahigh_storage';
const INITIAL_DATA = {
  thoughts: []
};

function saveData(data) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    if (isChromeApp()) {
      window.chrome.storage.local.set({ [STORAGE_KEY]: JSON.stringify(data) }, () => resolve());
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    resolve();
  });
}

function getData() {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    if (isChromeApp()) {
      window.chrome.storage.local.get({ [STORAGE_KEY]: null }, (data) =>
        resolve(JSON.parse(data[STORAGE_KEY]) || INITIAL_DATA)
      );
      return;
    }
    resolve(JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || INITIAL_DATA);
  });
}

export function saveThought(board, thought) {
  return getData().then((data) => {
    const thoughtWithId = {
      ...thought,
      _id: data.thoughts.length
    };

    data.thoughts.push(thoughtWithId);

    return saveData(data).then(() => thoughtWithId);
  });
}

export function getThoughts() {
  return getData().then(({ thoughts }) => thoughts);
}

export function deleteThought(board, thought) {
  return getData().then((data) => {
    const updatedData = {
      ...data,
      thoughts: data.thoughts.filter(({ id }) =>
        id !== thought.id
      )
    };
    return saveData(updatedData);
  });
}

export function updateThought(board, thought) {
  return getData().then((data) => {
    const updatedData = {
      ...data,
      thoughts: data.thoughts.map((thou) => {
        if (thought.id === thou.id) {
          return thought;
        }
        return thou;
      })
    };

    return saveData(updatedData);
  });
}
