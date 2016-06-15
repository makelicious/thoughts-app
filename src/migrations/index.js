import migration1 from './1';
import migration2 from './2';

import {
  setCurrentMigration,
  getCurrentMigration,
} from 'utils/storage';

const migrations = [migration1, migration2];

export function run() {
  const current = getCurrentMigration();
  const unrunMigrations = migrations.slice(current);
  unrunMigrations.forEach((mig) => mig.up());
  setCurrentMigration(migrations.length);
}
