import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { hydrogenModels } from '../../content/hydrogen-catalog-2026';

describe('hydrogen catalog assets', () => {
    it('points every hydrogen model image to a shipped public asset', () => {
        const missingAssets = Array.from(new Set(hydrogenModels.map((model) => model.image))).filter(
            (imagePath) => !fs.existsSync(path.join(process.cwd(), 'public', imagePath.replace(/^\//, '')))
        );

        expect(missingAssets).toEqual([]);
    });
});
