const ENTER = 13;
const BACKSPACE = 8;
const UP = 38;
const ESC = 27;

export function isThoughtCreatingKeypress(event) {
  const disallowedKeys = [ENTER, BACKSPACE, ESC];
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

export function isEsc(keyCode) {
  return keyCode === ESC;
}
