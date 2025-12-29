// MOCK DATA FOR SLOTIFY (Supabase Disconnected Mode)
export const IS_MOCK_MODE = true

export const MOCK_NOTIFICATIONS = [
    {
        id: 'notif-1',
        title: 'New Booking',
        message: 'Alice Johnson booked a Strategy Consultation for tomorrow.',
        type: 'booking',
        is_read: false,
        created_at: new Date().toISOString()
    },
    {
        id: 'notif-2',
        title: 'Payment Received',
        message: 'Payment of $150 received for Strategy Consultation.',
        type: 'payment',
        is_read: true,
        created_at: new Date(Date.now() - 3600000).toISOString()
    }
]

export const MOCK_USER = {
    id: 'mock-user-123',
    email: 'narvin@test.com',
    full_name: 'Narvin Test',
    role: 'organizer',
    status: 'active',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    business_name: 'Narvin Solutions',
    business_description: 'Expert consultation and scheduling services.',
}

export const MOCK_ADMIN = {
    ...MOCK_USER,
    id: 'mock-admin-999',
    role: 'admin',
    full_name: 'Narvin Admin'
}

export const MOCK_CUSTOMER = {
    ...MOCK_USER,
    id: 'mock-customer-456',
    role: 'customer',
    full_name: 'Narvin Customer'
}

export const MOCK_APPOINTMENTS = [
    {
        id: 'apt-1',
        title: 'Strategy Consultation',
        description: 'One-on-one session to discuss business growth strategy and implementation.',
        duration: 60,
        price: 150,
        location_details: 'Google Meet',
        is_active: true,
        max_capacity: 1,
        organizer_id: 'mock-user-123',
        image_url: 'https://images.unsplash.com/photo-1517245327045-9774d136a705?w=800&q=80',
        created_at: new Date().toISOString(),
        questions: [
            { id: 'q1', type: 'text', label: 'Company Name', required: true },
            { id: 'q2', type: 'textarea', label: 'What is your primary goal?', required: true }
        ]
    },
    {
        id: 'apt-2',
        title: 'Quick Catch-up',
        description: 'Short meeting for quick questions or status updates.',
        duration: 15,
        price: 0,
        location_details: 'Phone Call',
        is_active: true,
        max_capacity: 1,
        organizer_id: 'mock-user-123',
        image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
        created_at: new Date().toISOString(),
    },
    {
        id: 'apt-3',
        title: 'Technical Review',
        description: 'Code review and architecture discussion for mid-sized projects.',
        duration: 90,
        price: 250,
        location_details: 'Zoom',
        is_active: true,
        max_capacity: 5,
        organizer_id: 'mock-user-123',
        image_url: 'https://images.unsplash.com/photo-1522071823991-b9671f30c46f?w=800&q=80',
        created_at: new Date().toISOString(),
    }
]

export const MOCK_BOOKINGS = [
    {
        id: 'book-1',
        appointment_id: 'apt-1',
        customer_id: 'mock-customer-456',
        start_time: new Date(Date.now() + 86400000).toISOString(),
        end_time: new Date(Date.now() + 86400000 + 3600000).toISOString(),
        status: 'confirmed',
        total_price: 150,
        customer: { full_name: 'Alice Johnson', email: 'alice@example.com' },
        appointment: MOCK_APPOINTMENTS[0]
    },
    {
        id: 'book-2',
        appointment_id: 'apt-2',
        customer_id: 'mock-customer-456',
        start_time: new Date(Date.now() + 172800000).toISOString(),
        end_time: new Date(Date.now() + 172800000 + 900000).toISOString(),
        status: 'pending',
        total_price: 0,
        customer: { full_name: 'Bob Smith', email: 'bob@example.com' },
        appointment: MOCK_APPOINTMENTS[1]
    }
]

export const MOCK_STATS = {
    totalAppointments: 12,
    publishedAppointments: 8,
    totalBookings: 45,
    upcomingBookings: 12,
    totalRevenue: 2450.00,
    monthlyGrowth: 15.5
}
