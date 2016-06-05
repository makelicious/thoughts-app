import { refreshThoughts } from 'migrations/utils';
import { getThoughts, saveThoughts } from 'utils/storage';

// 1. Move individually stored todos from localstorage
// under our new thoughts_app key where all application data is stored

// 2. Update unfinished-todo => #unfinished-todo

export default {
  up() {
    const storedThoughts = JSON.parse(window.localStorage.getItem('thoughts')) || [];
    const refreshedThoughts = refreshThoughts(storedThoughts);

    saveThoughts(refreshedThoughts);

    window.localStorage.removeItem('thoughts');
  }
}
