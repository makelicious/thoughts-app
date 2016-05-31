export function createThought(text) {
  return {
    text,
    todos: parseTodos(text),
    hashtags: parseHashtags(text),
    createdAt: new Date()
  }
}

export function parseTodos(text) {
  const matches = text.match(/\[[x\s]?\]/ig);

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
  const normalHashtags = text.match(/\#[a-z0-9]+/ig) || [];

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
