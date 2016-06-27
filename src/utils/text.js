import { truncate } from 'lodash';

/*
 * Replaces the nth occurence of `pattern` with `replacer`
 *
 * replaceNth("hello hello hello", 1, /hello/g, "world")
 * => "hello world hello"
 */

export function replaceNth(text, index, pattern, replacer) {
  let i = 0;

  return text.replace(pattern, (match) => {
    if (i === index) {
      i++;
      return replacer;
    }

    i++;
    return match;
  });
}

export function breakText(text) {
  return truncate(text, {
    length: 200,
    omission: '...',
    separator: ' '

  });
}
