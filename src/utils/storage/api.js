const DOMAIN = 'https://evening-oasis-93330.herokuapp.com';

export function saveThought(board, thought) {
  return fetch(`${DOMAIN}/${board}/thoughts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(thought)
  })
  .then((res) => res.json());
}

export function getThoughts(board) {
  return fetch(`${DOMAIN}/${board}/thoughts`)
  .then((res) => res.json());
}

export function deleteThought(board, thought) {
  return fetch(`${DOMAIN}/${board}/thoughts/${thought.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export function updateThought(board, thought) {
  return fetch(`${DOMAIN}/${board}/thoughts/${thought.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(thought)
  })
  .then((res) => res.json());
}

export function searchThoughts(board, searchTerm) {
  return fetch(`${DOMAIN}/${board}/thoughts?search=${searchTerm}`)
  .then((res) => res.json());
}
