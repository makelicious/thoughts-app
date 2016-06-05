import { createThought } from 'utils/thought';

/*
 * Refreshes thought hashtags and todos
 * Example case would be i.e. if you've changed the stored hashtag
 * format from "tag" to "#tag" and and wanted to apply
 * this change also to old tags
 */

export function refreshThoughts(thoughts) {
  return thoughts.map((thought) => {
    const newThought = createThought(thought.text);
    newThought.id = thought.id;
    newThought.createdAt = thought.createdAt;
    return newThought;
  });
}
