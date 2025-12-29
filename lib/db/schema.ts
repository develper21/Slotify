import { pgTable, uuid, text, timestamp, boolean, decimal, integer, jsonb, time, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const profiles = pgTable('profiles', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').unique(),
    password: text('password'),
    fullName: text('full_name'),
    role: text('role', { enum: ['admin', 'organizer', 'customer'] }).default('customer'),
    status: text('status', { enum: ['active', 'suspended', 'pending'] }).default('pending'),
    avatarUrl: text('avatar_url'),
    businessName: text('business_name'),
    websiteUrl: text('website_url'),
    businessDescription: text('business_description'),
    timezone: text('timezone').default('UTC'),
    emailNotifications: boolean('email_notifications').default(true),
    smsNotifications: boolean('sms_notifications').default(false),
    defaultDuration: integer('default_duration').default(30),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const appointments = pgTable('appointments', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizerId: uuid('organizer_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
    title: text('title').notNull(),
    description: text('description'),
    duration: integer('duration').default(60),
    price: decimal('price', { precision: 10, scale: 2 }).default('0.00'),
    locationDetails: text('location_details'),
    imageUrl: text('image_url'),
    isActive: boolean('is_active').default(true),
    maxCapacity: integer('max_capacity').default(1),
    availability: jsonb('availability').default({}),
    questions: jsonb('questions').default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const bookings = pgTable('bookings', {
    id: uuid('id').defaultRandom().primaryKey(),
    appointmentId: uuid('appointment_id').references(() => appointments.id, { onDelete: 'cascade' }).notNull(),
    customerId: uuid('customer_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
    startTime: timestamp('start_time', { withTimezone: true }).notNull(),
    endTime: timestamp('end_time', { withTimezone: true }).notNull(),
    status: text('status', { enum: ['pending', 'confirmed', 'cancelled', 'pending_payment'] }).default('pending'),
    answers: jsonb('answers').default({}),
    totalPrice: decimal('total_price', { precision: 10, scale: 2 }).default('0.00'),
    paymentId: text('payment_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const notifications = pgTable('notifications', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
    title: text('title').notNull(),
    message: text('message').notNull(),
    type: text('type').default('info'),
    isRead: boolean('is_read').default(false),
    metadata: jsonb('metadata').default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const schedules = pgTable('schedules', {
    id: uuid('id').defaultRandom().primaryKey(),
    appointmentId: uuid('appointment_id').references(() => appointments.id, { onDelete: 'cascade' }),
    dayOfWeek: integer('day_of_week').notNull(),
    isWorkingDay: boolean('is_working_day').default(true),
    startTime: time('start_time').default('09:00'),
    endTime: time('end_time').default('17:00'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const bookingQuestions = pgTable('booking_questions', {
    id: uuid('id').defaultRandom().primaryKey(),
    appointmentId: uuid('appointment_id').references(() => appointments.id, { onDelete: 'cascade' }),
    label: text('label').notNull(),
    type: text('type').default('text'),
    required: boolean('required').default(false),
    options: jsonb('options').default([]),
    sortOrder: integer('sort_order').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Relations
export const profileRelations = relations(profiles, ({ many }) => ({
    appointments: many(appointments),
    bookings: many(bookings),
    notifications: many(notifications),
}));

export const appointmentRelations = relations(appointments, ({ one, many }) => ({
    organizer: one(profiles, { fields: [appointments.organizerId], references: [profiles.id] }),
    bookings: many(bookings),
    schedules: many(schedules),
    questions: many(bookingQuestions),
}));

export const bookingRelations = relations(bookings, ({ one }) => ({
    appointment: one(appointments, { fields: [bookings.appointmentId], references: [appointments.id] }),
    customer: one(profiles, { fields: [bookings.customerId], references: [profiles.id] }),
}));
