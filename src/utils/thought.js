import { uniq, flatten, pick } from 'lodash';

export const HASHTAG_REGEXP = /#[\w-_]+/g;

export const CHECKBOX_REGEXP = /\[[x\s]?\](?=\s|$)/ig;
export const LINK_REGEXP = /(?:\w+:)?\/\/(?:[^\s\.]+\.\S{2}|localhost[:?\d]*)\S*/g;

export const UNFINISHED_TODO_TAG = '#unfinished-todo';

export function getHashtags(thoughts) {
  const tags = thoughts.map(thought => thought.hashtags);
  const flattenedTags = _.flatten(tags);
  const uniqueTags = _.uniq(flattenedTags);

  return uniqueTags.sort();
}

export function createThought(text) {
  return {
    text,
    id: (Date.now() + Math.round(Math.random() * 10000)).toString(),
    todos: parseTodos(text),
    hashtags: parseHashtags(text),
    createdAt: new Date()
  };
}

export function sortByCreatedAt(thought, thought2) {
  return new Date(thought2.createdAt) - new Date(thought.createdAt);
}

export function parseTodos(text) {
  const matches = text.match(CHECKBOX_REGEXP);

  if (matches === null) {
    return [];
  }

  return matches.map((match) => ({
    finished: match.indexOf('x') > -1
  }));
}

export function parseImages(text) {
  const urls = text.match(LINK_REGEXP) || [];
  return urls.filter((url) =>
    url.endsWith('.jpg') ||
    url.endsWith('.png'));
}

export function parseHashtags(text) {
  const normalHashtags = text.match(HASHTAG_REGEXP) || [];

  const unfinishedTodos = parseTodos(text).filter((todo) => !todo.finished);

  if (unfinishedTodos.length === 0) {
    return normalHashtags;
  }

  return normalHashtags.concat(UNFINISHED_TODO_TAG);
}

export function getUnfinishedTodos(thoughts) {
  return thoughts.reduce((unfinished, thought) =>
    unfinished.concat(thought.todos.filter((todo) => !todo.finished))
  , []);
}

export function getAssociatedHashtags(hashtags, thoughts) {
  const isOtherHashtag = (hash) => hashtags.indexOf(hash) === -1;

  const allAssociated = thoughts.reduce((associated, thought) => {
    const includesHashtag = hashtags.every((hash) => thought.hashtags.indexOf(hash) > -1);

    if (includesHashtag) {
      const otherHashtags = thought.hashtags.filter(isOtherHashtag);
      return associated.concat(otherHashtags);
    }

    return associated;
  }, []);

  return uniq(allAssociated);
}
