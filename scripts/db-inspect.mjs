import postgres from 'postgres';

/**
 * SLOTIFY DB INSPECT
 * Prints table list and row counts for the chosen environment's DB.
 * Usage: node scripts/db-inspect.mjs [--env production]
 */

const fs = await import('node:fs');
const path = await import('node:path');

const envFlagIndex = process.argv.indexOf('--env');
const envName = envFlagIndex !== -1 ? process.argv[envFlagIndex + 1] : 'local';
const envFile = envName === 'production' ? '.env.production' : '.env.local';

function readEnvUrl(file) {
    try {
        const content = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');
        const match = content.match(/^DATABASE_URL=(.*)$/m);
        return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : '';
    } catch {
        return '';
    }
}

const connectionString = process.env.DATABASE_URL || readEnvUrl(envFile);
if (!connectionString) {
    console.error(`❌ DATABASE_URL not found in ${envFile}`);
    process.exit(1);
}

console.log(`🔗 Environment: ${envName} (${envFile})\n`);

const sql = postgres(connectionString, { max: 1 });

const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name`;

if (!tables.length) {
    console.log('⚠️  No tables found in public schema (database is empty).');
} else {
    for (const { table_name } of tables) {
        const [row] = await sql.unsafe(`SELECT COUNT(*)::int AS count FROM "${table_name}"`);
        console.log(`   ${table_name.padEnd(20)} ${row.count} rows`);
    }
}

await sql.end();
