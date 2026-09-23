import postgres from 'postgres';

/**
 * SLOTIFY DB RESET
 * Deletes ALL rows from every table (FK-safe order, identities restarted).
 * Usage: npm run db:reset   (alias for: node scripts/db-reset.mjs)
 */

const fs = await import('node:fs');
const path = await import('node:path');

function readEnvUrl() {
    try {
        const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf8');
        const match = envFile.match(/^DATABASE_URL=(.*)$/m);
        return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : '';
    } catch {
        return '';
    }
}

const connectionString = process.env.DATABASE_URL || readEnvUrl();

if (!connectionString) {
    console.error('❌ DATABASE_URL not found. Set it in .env.local');
    process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });

console.log('🧹 Clearing Slotify database...\n');

await sql`TRUNCATE TABLE booking_questions, notifications, schedules, bookings, appointments, profiles RESTART IDENTITY CASCADE;`;

const [row] = await sql`SELECT
    (SELECT COUNT(*)::int FROM profiles) AS profiles,
    (SELECT COUNT(*)::int FROM appointments) AS appointments,
    (SELECT COUNT(*)::int FROM bookings) AS bookings,
    (SELECT COUNT(*)::int FROM notifications) AS notifications,
    (SELECT COUNT(*)::int FROM schedules) AS schedules,
    (SELECT COUNT(*)::int FROM booking_questions) AS booking_questions`;

console.log('✅ Database is now empty:');
console.log(`   profiles=${row.profiles} appointments=${row.appointments} bookings=${row.bookings} notifications=${row.notifications} schedules=${row.schedules} booking_questions=${row.booking_questions}`);

await sql.end();
