import ts from 'typescript';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('tsconfig generated type includes', () => {
    it('pins the active Next generated route types for the primary build output', () => {
        const configPath = path.join(process.cwd(), 'tsconfig.json');
        const { config, error } = ts.readConfigFile(configPath, ts.sys.readFile);

        expect(error).toBeUndefined();
        expect(config.include).toContain('.next/types/**/*.ts');
        expect(config.include).toContain('.next-check/types/**/*.ts');
        expect(config.include).toContain('.next-check/dev/types/**/*.ts');
        expect(config.include).toContain('.next/dev/types/**/*.ts');
        expect(config.include).not.toContain('.next-preview/types/**/*.ts');
        expect(config.include).not.toContain('.next-preview/dev/types/**/*.ts');
    });
});
