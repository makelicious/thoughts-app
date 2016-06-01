const ENTER = 13;
const BACKSPACE = 8;
const UP = 38;

export function isThoughtCreatingKeypress(event) {
  const disallowedKeys = [ENTER, BACKSPACE];
  return !event.metaKey && disallowedKeys.indexOf(event.keyCode) === -1;
}

export function isBackspace(keyCode) {
  return keyCode === BACKSPACE;
}
export function isEnter(keyCode) {
  return keyCode === ENTER;
}

export function isUp(keyCode) {
  return keyCode === UP;
}
