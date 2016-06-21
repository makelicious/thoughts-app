import { uniq } from 'lodash';

export const HASHTAG_REGEXP = /\#\w+/g;
export const CHECKBOX_REGEXP = /\[[x\s]?\](?=\s|$)/ig;
export const UNFINISHED_TODO_TAG = '#unfinished-todo';

export function createThought(text) {
  return {
    text,
    id: Date.now(),
    todos: parseTodos(text),
    hashtags: parseHashtags(text),
    createdAt: new Date()
  }
}

export function parseTodos(text) {
  const matches = text.match(CHECKBOX_REGEXP);

  if(matches === null) {
    return [];
  }

  return matches.map((match) => {
    return {
      finished: match.indexOf('x') > -1
    };
  })
}

export function parseHashtags(text) {
  const normalHashtags = text.match(HASHTAG_REGEXP) || [];

  const unfinishedTodos = parseTodos(text).filter((todo) => !todo.finished);

  if(unfinishedTodos.length === 0) {
    return normalHashtags;
  }

  return normalHashtags.concat(UNFINISHED_TODO_TAG);
}

export function getUnfinishedTodos(thoughts) {
  return thoughts.reduce((unfinished, thought) => {
    return unfinished.concat(thought.todos.filter((todo) => !todo.finished));
  }, [])
}

export function getAssociatedHashtags(hashtags, thoughts) {
  const isOtherHashtag = (hash) => hashtags.indexOf(hash) === -1;

  const allAssociated = thoughts.reduce((associated, thought) => {
    const includesHashtag = hashtags.every((hash) => thought.hashtags.indexOf(hash) > -1);

    if(includesHashtag) {
      const otherHashtags = thought.hashtags.filter(isOtherHashtag);
      return associated.concat(otherHashtags);
    }

    return associated;
  }, []);

  return uniq(allAssociated);
}
