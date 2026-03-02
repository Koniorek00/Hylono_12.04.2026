import { defineConfig } from '@trigger.dev/sdk/v3';
import { env } from './lib/env';

export default defineConfig({
  project: env.TRIGGER_PROJECT_REF ?? 'proj_placeholder',
  maxDuration: 300,
  dirs: ['./src/trigger'],
});