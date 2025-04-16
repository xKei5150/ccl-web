import * as migration_20250415_223742 from './20250415_223742';

export const migrations = [
  {
    up: migration_20250415_223742.up,
    down: migration_20250415_223742.down,
    name: '20250415_223742'
  },
];
