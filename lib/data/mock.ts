// Mock data for testing without database

export const mockUsers = [
  {
    id: '1',
    full_name: 'John Doe',
    email: 'john@example.com',
    role: 'customer' as const,
    status: 'active' as const,
    created_at: new Date().toISOString(),
  },
  {
    id: '2', 
    full_name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'organizer' as const,
    status: 'active' as const,
    created_at: new Date().toISOString(),
  }
]

export const mockOrganizers = [
  {
    id: '1',
    user_id: '2',
    business_name: 'Tech Solutions Inc.',
    description: 'Professional tech consulting services',
    logo_url: null,
    website_url: 'https://techsolutions.com',
    approved: true,
    created_at: new Date().toISOString(),
  }
]

export const mockAppointments = [
  {
    id: '1',
    organizer_id: '1',
    title: 'Web Development Consultation',
    description: 'Get expert advice on your web development projects',
    duration: '00:30:00',
    location_type: 'online' as const,
    location_details: 'Google Meet',
    published: true,
    booking_enabled: true,
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    organizers: mockOrganizers[0],
    appointment_settings: {
      id: '1',
      appointment_id: '1',
      auto_confirmation: false,
      auto_assignment: false,
      capacity_enabled: false,
      min_capacity: 1,
      max_capacity: 1,
      manual_confirmation: false,
      paid_booking: false,
      price: 0,
      currency: 'USD',
      introduction_message: null,
      confirmation_message: null,
      meeting_instructions: null,
      meeting_type: 'online',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  },
  {
    id: '2',
    organizer_id: '1',
    title: 'Mobile App Strategy Session',
    description: 'Plan your mobile app development roadmap',
    duration: '01:00:00',
    location_type: 'offline' as const,
    location_details: 'Office Location',
    published: true,
    booking_enabled: true,
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    organizers: mockOrganizers[0],
    appointment_settings: {
      id: '2',
      appointment_id: '2',
      auto_confirmation: false,
      auto_assignment: false,
      capacity_enabled: false,
      min_capacity: 1,
      max_capacity: 1,
      manual_confirmation: false,
      paid_booking: false,
      price: 0,
      currency: 'USD',
      introduction_message: null,
      confirmation_message: null,
      meeting_instructions: null,
      meeting_type: 'offline',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }
]

export const mockTimeSlots = [
  {
    id: '1',
    appointment_id: '1',
    slot_date: '2024-12-25',
    start_time: '09:00:00',
    end_time: '09:30:00',
    max_capacity: 1,
    current_bookings: 0,
    available_capacity: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    appointment_id: '1',
    slot_date: '2024-12-25',
    start_time: '10:00:00',
    end_time: '10:30:00',
    max_capacity: 1,
    current_bookings: 0,
    available_capacity: 1,
    created_at: new Date().toISOString(),
  }
]

export const mockBookingQuestions = [
  {
    id: '1',
    appointment_id: '1',
    question_text: 'What is your current project status?',
    question_type: 'single_line' as const,
    options: null,
    is_mandatory: true,
    order_index: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    appointment_id: '1',
    question_text: 'Preferred communication method?',
    question_type: 'radio' as const,
    options: ['Email', 'Phone', 'Video Call'],
    is_mandatory: false,
    order_index: 1,
    created_at: new Date().toISOString(),
  }
]
