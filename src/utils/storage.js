export function saveThoughts(thoughts) {
  window.localStorage.setItem('thoughts', JSON.stringify(thoughts));
}

export function getThoughts() {
  return JSON.parse(window.localStorage.getItem('thoughts')) || [];
}
