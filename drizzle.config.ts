import { defineConfig } from 'drizzle-kit';
import fs from 'fs';
import path from 'path';

let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    try {
        const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf8');
        const match = envFile.match(/^DATABASE_URL=(.*)$/m);
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
