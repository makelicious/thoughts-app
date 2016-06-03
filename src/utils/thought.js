export const HASHTAG_REGEXP = /\#\w+/g;
export const CHECKBOX_REGEXP = /\[[x\s]?\]/ig;

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

  return normalHashtags.concat('unfinished-todo');
}

export function getUnfinishedTodos(thoughts) {
  return thoughts.reduce((unfinished, thought) => {
    return unfinished.concat(thought.todos.filter((todo) => !todo.finished));
  }, [])
}
