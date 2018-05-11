const ENTER = 13;
const BACKSPACE = 8;
// eslint-disable-next-line id-length
const UP = 38;
const ESC = 27;
const CTRL = 17;
const CMD = 91;
// eslint-disable-next-line id-length
const V = 86;

export function isThoughtCreatingKeypress(event) {
  const disallowedKeys = [BACKSPACE, ESC];
  const isPaste = (event.control || event.metaKey) && event.keyCode === 86;

  return (
    isPaste ||
    (!event.metaKey &&
      !event.control &&
      disallowedKeys.indexOf(event.keyCode) === -1)
  );
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

export function isV(keyCode) {
  return keyCode === V;
}

export function isCTRL(keyCode) {
  return keyCode === CTRL;
}

export function isCMD(keyCode) {
  return keyCode === CMD;
}
