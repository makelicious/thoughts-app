import { refreshThoughts } from 'migrations/utils';
import { getThoughts, saveThoughts } from 'utils/storage';

// Just refresh all stored hashtags
// fixes image markdown with empty alt-text being stored as todo

export default {
  up() {
    saveThoughts(refreshThoughts(getThoughts()));
  }
}
