import { defineConfig } from 'drizzle-kit';
import fs from 'fs';
import path from 'path';

// Usage: npx drizzle-kit push --env production  (defaults to .env.local)
const envFlagIndex = process.argv.indexOf('--env');
const envName = envFlagIndex !== -1 ? process.argv[envFlagIndex + 1] : 'local';
const envFile = envName === 'production' ? '.env.production' : '.env.local';

let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    try {
        const envFileContent = fs.readFileSync(path.resolve(process.cwd(), envFile), 'utf8');
        const match = envFileContent.match(/^DATABASE_URL=(.*)$/m);
        if (match) {
            databaseUrl = match[1].trim().replace(/^['"]|['"]$/g, '');
        }
    } catch {}
}

export default defineConfig({
    schema: './lib/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: databaseUrl || '',
    },
});
