import postgres from 'postgres';
import bcrypt from 'bcryptjs';

/**
 * SLOTIFY SEED DATA
 * Populates the entire database with realistic demo data that exercises
 * every frontend surface:
 *   - Landing/marketplace  -> published appointments + organizer info
 *   - Booking flow         -> availability, slots, questions, capacity
 *   - Organizer dashboard  -> stats, 30-day bookings chart, recent bookings
 *   - Admin console        -> users, organizers (incl. 1 pending approval)
 *   - Notifications UI     -> per-user notification feed
 *   - Questions manager    -> booking_questions rows + jsonb questions
 *
 * Usage:  npm run db:reset && npm run db:seed
 * Login:  admin@slotify.test / organizer@slotify.test / aarav@example.com
 *         (all with password: Password123!)
 */

const fs = await import('node:fs');
const path = await import('node:path');

// Usage: npm run db:seed [-- --env production]  (or: node scripts/db-seed.mjs --env production)
const envFlagIndex = process.argv.indexOf('--env');
const envName = envFlagIndex !== -1 ? process.argv[envFlagIndex + 1] : 'local';
const envFile = envName === 'production' ? '.env.production' : '.env.local';

function readEnvUrl(file) {
    try {
        const envFileContent = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');
        const match = envFileContent.match(/^DATABASE_URL=(.*)$/m);
        return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : '';
    } catch {
        return '';
    }
}

const connectionString = process.env.DATABASE_URL || readEnvUrl(envFile);
if (!connectionString) {
    console.error(`❌ DATABASE_URL not found. Set it in ${envFile}`);
    process.exit(1);
}
console.log(`🔗 Using environment: ${envName} (${envFile})`);

const sql = postgres(connectionString, { max: 1 });

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const now = new Date();
function at(dayOffset, hour, minute = 0) {
    const d = new Date(now);
    d.setDate(d.getDate() + dayOffset);
    d.setHours(hour, minute, 0, 0);
    return d;
}

function weekAvailability(start = '09:00', end = '17:00', sundayActive = false) {
    const off = { active: false, slots: [] };
    const on = { active: true, slots: [{ start, end }] };
    return {
        sunday: sundayActive ? on : off,
        monday: on,
        tuesday: on,
        wednesday: on,
        thursday: on,
        friday: on,
        saturday: off,
    };
}

const fitnessAvailability = {
    sunday: { active: false, slots: [] },
    monday: { active: true, slots: [{ start: '06:00', end: '10:00' }, { start: '17:00', end: '20:00' }] },
    tuesday: { active: true, slots: [{ start: '06:00', end: '10:00' }, { start: '17:00', end: '20:00' }] },
    wednesday: { active: true, slots: [{ start: '06:00', end: '10:00' }, { start: '17:00', end: '20:00' }] },
    thursday: { active: true, slots: [{ start: '06:00', end: '10:00' }, { start: '17:00', end: '20:00' }] },
    friday: { active: true, slots: [{ start: '06:00', end: '10:00' }, { start: '17:00', end: '20:00' }] },
    saturday: { active: true, slots: [{ start: '07:00', end: '11:00' }] },
};

const yogaAvailability = {
    sunday: { active: true, slots: [{ start: '07:00', end: '09:00' }] },
    monday: { active: true, slots: [{ start: '06:00', end: '08:00' }, { start: '18:00', end: '19:30' }] },
    tuesday: { active: true, slots: [{ start: '06:00', end: '08:00' }, { start: '18:00', end: '19:30' }] },
    wednesday: { active: true, slots: [{ start: '06:00', end: '08:00' }, { start: '18:00', end: '19:30' }] },
    thursday: { active: true, slots: [{ start: '06:00', end: '08:00' }, { start: '18:00', end: '19:30' }] },
    friday: { active: true, slots: [{ start: '06:00', end: '08:00' }] },
    saturday: { active: true, slots: [{ start: '08:00', end: '10:00' }] },
};

function avatars(initials, bg = '10B981') {
    return `https://ui-avatars.com/api/?background=${bg}&color=fff&bold=true&name=${encodeURIComponent(initials)}`;
}

/* ------------------------------------------------------------------ */
/* Profiles (1 admin, 4 organizers, 4 customers)                       */
/* ------------------------------------------------------------------ */

const PASSWORD = await bcrypt.hash('Password123!', 10);

const adminId = '11111111-1111-4111-8111-111111111111';
const org1 = '22222222-2222-4222-8222-222222222221'; // Priya Sharma  (design studio)
const org2 = '22222222-2222-4222-8222-222222222222'; // Arjun Mehta   (fitness lab)
const org3 = '22222222-2222-4222-8222-222222222223'; // Sara Ali      (yoga & mindfulness)
const org4 = '22222222-2222-4222-8222-222222222224'; // Rohit Verma   (pending approval)
const cust1 = '33333333-3333-4333-8333-333333333331'; // Aarav Kapoor
const cust2 = '33333333-3333-4333-8333-333333333332'; // Neha Gupta
const cust3 = '33333333-3333-4333-8333-333333333333'; // Ishan Roy
const cust4 = '33333333-3333-4333-8333-333333333334'; // Meera Nair

const profiles = [
    {
        id: adminId,
        email: 'admin@slotify.test',
        password: PASSWORD,
        fullName: 'Narvin Admin',
        role: 'admin',
        status: 'active',
        avatarUrl: avatars('NA', '0EA5E9'),
        timezone: 'Asia/Kolkata',
        emailNotifications: true,
        smsNotifications: false,
        defaultDuration: 30,
        createdAt: at(-120, 10),
        updatedAt: at(-120, 10),
    },
    {
        id: org1,
        email: 'organizer@slotify.test',
        password: PASSWORD,
        fullName: 'Priya Sharma',
        role: 'organizer',
        status: 'active',
        avatarUrl: avatars('PS', '10B981'),
        businessName: 'Lumen Design Studio',
        websiteUrl: 'https://lumendesign.example.com',
        businessDescription: 'Brand strategy, UX audits and design sprints for early-stage startups. Every session ends with an actionable roadmap.',
        timezone: 'Asia/Kolkata',
        emailNotifications: true,
        smsNotifications: true,
        defaultDuration: 30,
        createdAt: at(-90, 9),
        updatedAt: at(-10, 15),
    },
    {
        id: org2,
        email: 'arjun.fitness@slotify.test',
        password: PASSWORD,
        fullName: 'Arjun Mehta',
        role: 'organizer',
        status: 'active',
        avatarUrl: avatars('AM', 'F59E0B'),
        businessName: 'Mehta Fitness Lab',
        websiteUrl: 'https://mehtafitness.example.com',
        businessDescription: 'Certified strength & conditioning coach. 1-on-1 training, form assessments and group bootcamps.',
        timezone: 'Asia/Kolkata',
        emailNotifications: true,
        smsNotifications: false,
        defaultDuration: 60,
        createdAt: at(-75, 11),
        updatedAt: at(-12, 9),
    },
    {
        id: org3,
        email: 'sara.yoga@slotify.test',
        password: PASSWORD,
        fullName: 'Sara Ali',
        role: 'organizer',
        status: 'active',
        avatarUrl: avatars('SA', '8B5CF6'),
        businessName: 'Mindful Guidance',
        websiteUrl: 'https://mindfulguidance.example.com',
        businessDescription: 'Hatha yoga, guided meditation and corporate wellness workshops — on the mat or online.',
        timezone: 'Asia/Kolkata',
        emailNotifications: false,
        smsNotifications: true,
        defaultDuration: 60,
        createdAt: at(-60, 8),
        updatedAt: at(-20, 18),
    },
    {
        id: org4,
        email: 'rohit.consults@slotify.test',
        password: PASSWORD,
        fullName: 'Rohit Verma',
        role: 'organizer',
        status: 'pending',
        avatarUrl: avatars('RV', '6B7280'),
        businessName: 'Verma Growth Advisory',
        websiteUrl: 'https://vermagrowth.example.com',
        businessDescription: 'GTM consulting for B2B SaaS teams. Waiting for admin approval.',
        timezone: 'Asia/Kolkata',
        emailNotifications: true,
        smsNotifications: false,
        defaultDuration: 45,
        createdAt: at(-3, 14),
        updatedAt: at(-3, 14),
    },
    {
        id: cust1,
        email: 'aarav@example.com',
        password: PASSWORD,
        fullName: 'Aarav Kapoor',
        role: 'customer',
        status: 'active',
        avatarUrl: avatars('AK', '6366F1'),
        timezone: 'Asia/Kolkata',
        emailNotifications: true,
        smsNotifications: false,
        defaultDuration: 30,
        createdAt: at(-45, 12),
        updatedAt: at(-45, 12),
    },
    {
        id: cust2,
        email: 'neha@example.com',
        password: PASSWORD,
        fullName: 'Neha Gupta',
        role: 'customer',
        status: 'active',
        avatarUrl: avatars('NG', 'EC4899'),
        timezone: 'Asia/Kolkata',
        emailNotifications: true,
        smsNotifications: true,
        defaultDuration: 30,
        createdAt: at(-38, 16),
        updatedAt: at(-38, 16),
    },
    {
        id: cust3,
        email: 'ishan@example.com',
        password: PASSWORD,
        fullName: 'Ishan Roy',
        role: 'customer',
        status: 'active',
        avatarUrl: avatars('IR', '14B8A6'),
        timezone: 'Asia/Kolkata',
        emailNotifications: false,
        smsNotifications: false,
        defaultDuration: 30,
        createdAt: at(-30, 10),
        updatedAt: at(-30, 10),
    },
    {
        id: cust4,
        email: 'meera@example.com',
        password: PASSWORD,
        fullName: 'Meera Nair',
        role: 'customer',
        status: 'active',
        avatarUrl: avatars('MN', 'EF4444'),
        timezone: 'Asia/Kolkata',
        emailNotifications: true,
        smsNotifications: false,
        defaultDuration: 30,
        createdAt: at(-15, 9),
        updatedAt: at(-15, 9),
    },
];

/* ------------------------------------------------------------------ */
/* Appointments (8)                                                    */
/* ------------------------------------------------------------------ */

const apt1 = 'aaaaaaaa-0000-4000-8000-000000000001';
const apt2 = 'aaaaaaaa-0000-4000-8000-000000000002';
const apt3 = 'aaaaaaaa-0000-4000-8000-000000000003';
const apt4 = 'aaaaaaaa-0000-4000-8000-000000000004';
const apt5 = 'aaaaaaaa-0000-4000-8000-000000000005';
const apt6 = 'aaaaaaaa-0000-4000-8000-000000000006';
const apt7 = 'aaaaaaaa-0000-4000-8000-000000000007';
const apt8 = 'aaaaaaaa-0000-4000-8000-000000000008';

const appointments = [
    {
        id: apt1,
        organizerId: org1,
        title: 'Brand Strategy Consultation',
        description: 'A focused 1:1 session to position your brand, define your audience and build a 90-day content & growth roadmap.',
        duration: 60,
        price: '150.00',
        locationDetails: 'Google Meet',
        imageUrl: 'https://images.unsplash.com/photo-1517245327045-9774d136a705?w=800&q=80',
        isActive: true,
        maxCapacity: 1,
        availability: weekAvailability('10:00', '18:00'),
        questions: [
            { id: 'q1', type: 'text', label: 'Company Name', isMandatory: true },
            { id: 'q2', type: 'textarea', label: 'What is your primary goal for this session?', isMandatory: true },
            { id: 'q3', type: 'checkbox', label: 'Which areas should we focus on?', isMandatory: false, options: ['Positioning', 'Pricing', 'Website UX', 'Content Strategy'] },
        ],
        createdAt: at(-85, 10),
        updatedAt: at(-8, 12),
    },
    {
        id: apt2,
        organizerId: org1,
        title: 'Quick Portfolio Review',
        description: 'A short call to review your portfolio, resume or landing page with rapid-fire actionable feedback.',
        duration: 15,
        price: '0.00',
        locationDetails: 'Phone Call',
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
        isActive: true,
        maxCapacity: 1,
        availability: weekAvailability('11:00', '13:00'),
        questions: [
            { id: 'q1', type: 'text', label: 'Link to your portfolio', isMandatory: true },
        ],
        createdAt: at(-70, 15),
        updatedAt: at(-70, 15),
    },
    {
        id: apt3,
        organizerId: org1,
        title: 'Full UX Audit Workshop',
        description: 'Deep-dive workshop covering your entire product UX: navigation, onboarding, checkout and retention loops. Includes a written audit report.',
        duration: 120,
        price: '400.00',
        locationDetails: 'Zoom',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
        isActive: false,
        maxCapacity: 3,
        availability: weekAvailability('13:00', '17:00'),
        questions: [
            { id: 'q1', type: 'text', label: 'Product URL', isMandatory: true },
            { id: 'q2', type: 'textarea', label: 'Where do users drop off the most?', isMandatory: false },
            { id: 'q4', type: 'phone', label: 'Best contact number', isMandatory: false },
        ],
        createdAt: at(-65, 11),
        updatedAt: at(-30, 9),
    },
    {
        id: apt4,
        organizerId: org2,
        title: 'Personal Training Session',
        description: '1-on-1 strength & conditioning session tailored to your level. Warm-up, progressive overload block and cooldown included.',
        duration: 60,
        price: '80.00',
        locationDetails: 'Mehta Fitness Lab, Bandra West',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
        isActive: true,
        maxCapacity: 1,
        availability: fitnessAvailability,
        questions: [
            { id: 'q1', type: 'checkbox', label: 'Any injuries we should know about?', isMandatory: true, options: ['Knee', 'Lower Back', 'Shoulder', 'None'] },
            { id: 'q2', type: 'text', label: 'Current fitness level', isMandatory: false },
        ],
        createdAt: at(-72, 7),
        updatedAt: at(-6, 19),
    },
    {
        id: apt5,
        organizerId: org2,
        title: 'Group Bootcamp (Max 10)',
        description: 'High-energy morning bootcamp: circuits, kettlebells and bodyweight strength. All levels welcome — capacity capped at 10 athletes.',
        duration: 45,
        price: '25.00',
        locationDetails: 'Outdoor Turf, Carter Road',
        imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
        isActive: true,
        maxCapacity: 10,
        availability: fitnessAvailability,
        questions: [
            { id: 'q1', type: 'checkbox', label: 'Have you joined a bootcamp before?', isMandatory: false, options: ['Yes', 'No'] },
        ],
        createdAt: at(-50, 8),
        updatedAt: at(-50, 8),
    },
    {
        id: apt6,
        organizerId: org2,
        title: 'Movement & Form Assessment',
        description: 'Functional movement screening: squat, hinge, press and pull patterns analysed on video with a corrective plan emailed after.',
        duration: 30,
        price: '50.00',
        locationDetails: 'Mehta Fitness Lab, Bandra West',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        isActive: true,
        maxCapacity: 1,
        availability: weekAvailability('16:00', '20:00'),
        questions: [
            { id: 'q1', type: 'phone', label: 'WhatsApp number for your video report', isMandatory: true },
        ],
        createdAt: at(-40, 13),
        updatedAt: at(-40, 13),
    },
    {
        id: apt7,
        organizerId: org3,
        title: 'Sunrise Hatha Yoga Class',
        description: 'Traditional hatha flow with breathwork to open your day. Mats provided; suitable for beginners and intermediate practitioners.',
        duration: 60,
        price: '20.00',
        locationDetails: 'Rooftop Studio, Khar',
        imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80',
        isActive: true,
        maxCapacity: 12,
        availability: yogaAvailability,
        questions: [
            { id: 'q1', type: 'checkbox', label: 'Experience level', isMandatory: true, options: ['Beginner', 'Intermediate', 'Advanced'] },
        ],
        createdAt: at(-55, 6),
        updatedAt: at(-5, 7),
    },
    {
        id: apt8,
        organizerId: org3,
        title: 'Guided Meditation (Online)',
        description: 'Live 30-minute guided meditation over Zoom. Breath awareness, body scan and a short closing journaling prompt.',
        duration: 30,
        price: '0.00',
        locationDetails: 'Zoom',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        isActive: true,
        maxCapacity: 25,
        availability: yogaAvailability,
        questions: [],
        createdAt: at(-35, 20),
        updatedAt: at(-35, 20),
    },
];

/* ------------------------------------------------------------------ */
/* Schedules (7 rows per active appointment)                           */
/* ------------------------------------------------------------------ */

const schedules = [];
for (const apt of appointments) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    days.forEach((day, dayOfWeek) => {
        const conf = apt.availability[day];
        if (!conf?.active || !conf.slots?.length) return;
        for (const slot of conf.slots) {
            schedules.push({
                appointmentId: apt.id,
                dayOfWeek,
                isWorkingDay: true,
                startTime: `${slot.start}:00`,
                endTime: `${slot.end}:00`,
                createdAt: apt.createdAt,
            });
        }
    });
}

/* ------------------------------------------------------------------ */
/* Booking questions (table-backed rows for the Questions manager UI)  */
/* ------------------------------------------------------------------ */

const bookingQuestions = [
    { id: 'cccccccc-0000-4000-8000-000000000001', appointmentId: apt1, label: 'Company Name', type: 'text', required: true, options: [], sortOrder: 0, createdAt: at(-80, 10) },
    { id: 'cccccccc-0000-4000-8000-000000000002', appointmentId: apt1, label: 'What is your primary goal for this session?', type: 'textarea', required: true, options: [], sortOrder: 1, createdAt: at(-80, 10) },
    { id: 'cccccccc-0000-4000-8000-000000000003', appointmentId: apt1, label: 'Which areas should we focus on?', type: 'checkbox', required: false, options: ['Positioning', 'Pricing', 'Website UX', 'Content Strategy'], sortOrder: 2, createdAt: at(-80, 10) },
    { id: 'cccccccc-0000-4000-8000-000000000004', appointmentId: apt4, label: 'Any injuries we should know about?', type: 'checkbox', required: true, options: ['Knee', 'Lower Back', 'Shoulder', 'None'], sortOrder: 0, createdAt: at(-70, 9) },
];

/* ------------------------------------------------------------------ */
/* Bookings (14) — spread across the last 30 days for the chart        */
/* ------------------------------------------------------------------ */

const bookings = [
    // --- Past, completed (confirmed + paid) ---
    { id: 'bbbbbbbb-0000-4000-8000-000000000001', appointmentId: apt1, customerId: cust1, startTime: at(-21, 11), endTime: at(-21, 12), status: 'confirmed', answers: { q1: 'Fable Labs', q2: 'Reposition our B2B brand for enterprise buyers.', q3: 'Positioning, Pricing' }, totalPrice: '150.00', paymentId: 'pi_seed_0001', createdAt: at(-24, 9) },
    { id: 'bbbbbbbb-0000-4000-8000-000000000002', appointmentId: apt4, customerId: cust2, startTime: at(-18, 18), endTime: at(-18, 19), status: 'confirmed', answers: { q1: 'None', q2: 'Intermediate' }, totalPrice: '80.00', paymentId: 'pi_seed_0002', createdAt: at(-20, 10) },
    { id: 'bbbbbbbb-0000-4000-8000-000000000003', appointmentId: apt7, customerId: cust3, startTime: at(-14, 7), endTime: at(-14, 8), status: 'confirmed', answers: { q1: 'Beginner' }, totalPrice: '20.00', paymentId: 'pi_seed_0003', createdAt: at(-16, 20) },
    { id: 'bbbbbbbb-0000-4000-8000-000000000004', appointmentId: apt5, customerId: cust1, startTime: at(-10, 7), endTime: at(-10, 8), status: 'confirmed', answers: { q1: 'Yes' }, totalPrice: '25.00', paymentId: 'pi_seed_0004', createdAt: at(-12, 6) },
    { id: 'bbbbbbbb-0000-4000-8000-000000000005', appointmentId: apt1, customerId: cust2, startTime: at(-7, 15), endTime: at(-7, 16), status: 'confirmed', answers: { q1: 'Craftly', q2: 'Redesign pricing page for higher conversion.', q3: 'Website UX' }, totalPrice: '150.00', paymentId: 'pi_seed_0005', createdAt: at(-9, 11) },
    { id: 'bbbbbbbb-0000-4000-8000-000000000006', appointmentId: apt8, customerId: cust4, startTime: at(-5, 18), endTime: at(-5, 19), status: 'confirmed', answers: {}, totalPrice: '0.00', paymentId: null, createdAt: at(-6, 21) },

    // --- Cancelled ---
    { id: 'bbbbbbbb-0000-4000-8000-000000000007', appointmentId: apt6, customerId: cust3, startTime: at(-4, 17), endTime: at(-4, 18), status: 'cancelled', answers: { q1: '9876501234' }, totalPrice: '50.00', paymentId: null, createdAt: at(-8, 14) },
    { id: 'bbbbbbbb-0000-4000-8000-000000000008', appointmentId: apt2, customerId: cust2, startTime: at(2, 11, 30), endTime: at(2, 11, 45), status: 'cancelled', answers: { q1: 'nehasharma.design' }, totalPrice: '0.00', paymentId: null, createdAt: at(-3, 16) },

    // --- Upcoming: pending organizer approval (free services) ---
    { id: 'bbbbbbbb-0000-4000-8000-000000000009', appointmentId: apt2, customerId: cust1, startTime: at(1, 11, 15), endTime: at(1, 11, 30), status: 'pending', answers: { q1: 'aaravkapoor.framer.website' }, totalPrice: '0.00', paymentId: null, createdAt: at(-1, 12) },
    { id: 'bbbbbbbb-0000-4000-8000-000000000010', appointmentId: apt8, customerId: cust2, startTime: at(1, 18), endTime: at(1, 18, 30), status: 'pending', answers: {}, totalPrice: '0.00', paymentId: null, createdAt: at(-1, 19) },
    { id: 'bbbbbbbb-0000-4000-8000-000000000011', appointmentId: apt7, customerId: cust4, startTime: at(3, 7), endTime: at(3, 8), status: 'pending', answers: { q1: 'Intermediate' }, totalPrice: '20.00', paymentId: null, createdAt: at(0, 8) },

    // --- Upcoming: awaiting payment (paid services) ---
    { id: 'bbbbbbbb-0000-4000-8000-000000000012', appointmentId: apt4, customerId: cust3, startTime: at(2, 7), endTime: at(2, 8), status: 'pending_payment', answers: { q1: 'Lower Back', q2: 'Beginner' }, totalPrice: '80.00', paymentId: null, createdAt: at(0, 9) },
    { id: 'bbbbbbbb-0000-4000-8000-000000000013', appointmentId: apt1, customerId: cust4, startTime: at(4, 12), endTime: at(4, 13), status: 'pending_payment', answers: { q1: 'Mirai Studio', q2: 'Launch strategy for our D2C skincare line.', q3: 'Content Strategy' }, totalPrice: '150.00', paymentId: null, createdAt: at(0, 10) },

    // --- Upcoming: confirmed ---
    { id: 'bbbbbbbb-0000-4000-8000-000000000014', appointmentId: apt5, customerId: cust2, startTime: at(3, 7), endTime: at(3, 8), status: 'confirmed', answers: { q1: 'Yes' }, totalPrice: '25.00', paymentId: 'pi_seed_0006', createdAt: at(-2, 15) },
    { id: 'bbbbbbbb-0000-4000-8000-000000000015', appointmentId: apt6, customerId: cust1, startTime: at(5, 17), endTime: at(5, 18), status: 'confirmed', answers: { q1: '9812345670' }, totalPrice: '50.00', paymentId: 'pi_seed_0007', createdAt: at(-2, 18) },
    { id: 'bbbbbbbb-0000-4000-8000-000000000016', appointmentId: apt7, customerId: cust3, startTime: at(6, 7), endTime: at(6, 8), status: 'confirmed', answers: { q1: 'Advanced' }, totalPrice: '20.00', paymentId: 'pi_seed_0008', createdAt: at(-1, 7) },
];

/* ------------------------------------------------------------------ */
/* Notifications — feeds for organizer, customers and admin            */
/* ------------------------------------------------------------------ */

const notifications = [
    // Organizer (Priya / org1)
    { id: 'dddddddd-0000-4000-8000-000000000001', userId: org1, title: 'New Booking', message: 'Meera Nair booked Brand Strategy Consultation.', type: 'booking', isRead: false, metadata: { bookingId: 'bbbbbbbb-0000-4000-8000-000000000013' }, createdAt: at(0, 10) },
    { id: 'dddddddd-0000-4000-8000-000000000002', userId: org1, title: 'Payment Received', message: 'Payment of $150.00 received for Brand Strategy Consultation.', type: 'payment', isRead: false, metadata: { amount: 150.0 }, createdAt: at(-9, 12) },
    { id: 'dddddddd-0000-4000-8000-000000000003', userId: org1, title: 'Booking Cancelled', message: 'Neha Gupta cancelled Quick Portfolio Review.', type: 'cancellation', isRead: true, metadata: {}, createdAt: at(-3, 17) },
    { id: 'dddddddd-0000-4000-8000-000000000004', userId: org1, title: 'New Booking Request', message: 'Aarav Kapoor requested Quick Portfolio Review — awaiting your approval.', type: 'booking', isRead: false, metadata: { bookingId: 'bbbbbbbb-0000-4000-8000-000000000009' }, createdAt: at(-1, 12) },
    { id: 'dddddddd-0000-4000-8000-000000000005', userId: org1, title: 'Payment Received', message: 'Payment of $400.00 received for Full UX Audit Workshop.', type: 'payment', isRead: true, metadata: { amount: 400.0 }, createdAt: at(-30, 13) },
    { id: 'dddddddd-0000-4000-8000-000000000006', userId: org1, title: 'Schedule Reminder', message: 'You have 3 sessions scheduled this week.', type: 'reminder', isRead: true, metadata: {}, createdAt: at(-2, 8) },

    // Customer (Aarav / cust1)
    { id: 'dddddddd-0000-4000-8000-000000000007', userId: cust1, title: 'Booking Confirmed', message: 'Your Personal Training follow-up is confirmed for the coming week.', type: 'booking', isRead: false, metadata: { bookingId: 'bbbbbbbb-0000-4000-8000-000000000015' }, createdAt: at(-2, 18) },
    { id: 'dddddddd-0000-4000-8000-000000000008', userId: cust1, title: 'Payment Receipt', message: 'Payment of $25.00 received for Group Bootcamp.', type: 'payment', isRead: false, metadata: { amount: 25.0 }, createdAt: at(-12, 6) },
    { id: 'dddddddd-0000-4000-8000-000000000009', userId: cust1, title: 'Upcoming Session Reminder', message: 'Your session starts in 24 hours. Don\'t forget to prepare your questions!', type: 'reminder', isRead: true, metadata: {}, createdAt: at(-11, 7) },
    { id: 'dddddddd-0000-4000-8000-000000000010', userId: cust1, title: 'Booking Confirmed', message: 'Priya Sharma confirmed your Brand Strategy Consultation.', type: 'booking', isRead: true, metadata: {}, createdAt: at(-24, 10) },

    // Customer (Neha / cust2)
    { id: 'dddddddd-0000-4000-8000-000000000011', userId: cust2, title: 'Booking Confirmed', message: 'Your Group Bootcamp spot is confirmed for this week.', type: 'booking', isRead: false, metadata: {}, createdAt: at(-2, 15) },
    { id: 'dddddddd-0000-4000-8000-000000000012', userId: cust2, title: 'Payment Receipt', message: 'Payment of $80.00 received for Personal Training Session.', type: 'payment', isRead: true, metadata: { amount: 80.0 }, createdAt: at(-20, 11) },

    // Admin
    { id: 'dddddddd-0000-4000-8000-000000000013', userId: adminId, title: 'Organizer Approval Needed', message: 'Rohit Verma signed up as an organizer and is awaiting approval.', type: 'system', isRead: false, metadata: { userId: org4 }, createdAt: at(-3, 14) },
    { id: 'dddddddd-0000-4000-8000-000000000014', userId: adminId, title: 'Weekly Platform Report', message: '16 bookings this month across 7 published services.', type: 'system', isRead: true, metadata: {}, createdAt: at(-7, 9) },
];

/* ------------------------------------------------------------------ */
/* Insert helpers                                                      */
/* ------------------------------------------------------------------ */

async function insertTable(table, rows) {
    if (!rows.length) return;
    const toSnake = (k) => k.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
    const snakeRows = rows.map((r) =>
        Object.fromEntries(Object.entries(r).map(([k, v]) => [toSnake(k), v]))
    );
    const cols = Object.keys(snakeRows[0]);
    await sql`INSERT INTO ${sql(table)} ${sql(snakeRows, cols)}`;
}

/* ------------------------------------------------------------------ */
/* Run                                                                 */
/* ------------------------------------------------------------------ */

async function seed() {
    console.log('🌱 Seeding Slotify database...\n');

    await insertTable('profiles', profiles);
    console.log(`✅ profiles            ${profiles.length}`);

    await insertTable('appointments', appointments);
    console.log(`✅ appointments        ${appointments.length}`);

    await insertTable('schedules', schedules);
    console.log(`✅ schedules           ${schedules.length}`);

    await insertTable('booking_questions', bookingQuestions);
    console.log(`✅ booking_questions   ${bookingQuestions.length}`);

    await insertTable('bookings', bookings);
    console.log(`✅ bookings            ${bookings.length}`);

    await insertTable('notifications', notifications);
    console.log(`✅ notifications       ${notifications.length}`);

    console.log('\n📊 Summary by status:');
    const byStatus = {};
    bookings.forEach((b) => (byStatus[b.status] = (byStatus[b.status] || 0) + 1));
    Object.entries(byStatus).forEach(([k, v]) => console.log(`   ${k}: ${v}`));

    console.log('\n👤 Demo logins (password: Password123!)');
    console.log('   Admin     : admin@slotify.test');
    console.log('   Organizer : organizer@slotify.test   (Priya — 3 services, most bookings)');
    console.log('   Organizer : arjun.fitness@slotify.test (Arjun — fitness services)');
    console.log('   Organizer : sara.yoga@slotify.test     (Sara — yoga services)');
    console.log('   Organizer : rohit.consults@slotify.test (Rohit — PENDING approval)');
    console.log('   Customer  : aarav@example.com / neha@example.com / ishan@example.com / meera@example.com');

    console.log('\n🔑 Fixed IDs for API testing:');
    console.log(`   adminId       = ${adminId}`);
    console.log(`   organizerId   = ${org1}`);
    console.log(`   customerId    = ${cust1}`);
    console.log(`   appointmentId = ${apt1} (paid, questions, weekend off)`);
    console.log(`   appointmentId = ${apt5} (group capacity 10)`);
    console.log(`   appointmentId = ${apt2} (free — bookings land as "pending")`);
    console.log(`   bookingId     = ${bookings[0].id}`);

    await sql.end();
    console.log('\n🎉 Seed complete!');
}

seed().catch(async (e) => {
    console.error('❌ Seed failed:', e.message);
    await sql.end().catch(() => {});
    process.exit(1);
});
