export const createMockClient = () => {
    console.log('--- CREATING MOCK SUPABASE CLIENT ---');

    // Mock Query Builder with Data Simulation
    const createQueryBuilder = (tableName: string) => {
        const builder = {
            select: (columns: string) => {
                console.log(`Mock DB Select from ${tableName}: ${columns}`);
                return builder;
            },
            insert: () => builder,
            update: () => builder,
            delete: () => builder,
            eq: (column: string, value: any) => {
                console.log(`Mock DB Eq on ${tableName}: ${column} = ${value}`);
                return builder;
            },
            neq: () => builder,
            gt: () => builder,
            gte: () => builder,
            lt: () => builder,
            lte: () => builder,
            in: () => builder,
            is: () => builder,
            like: () => builder,
            ilike: () => builder,
            contains: () => builder,
            range: () => builder,
            order: () => builder,
            limit: () => builder,
            single: () => {
                // Mock SINGLE response data based on context if possible, strictly for UI unblocking
                // Default to returning a user with 'organizer' role to pass the dashboard check
                const mockUser = {
                    id: 'mock-user-1',
                    email: 'demo@slotify.com',
                    user_metadata: {
                        full_name: 'Charlie Customer',
                        role: 'customer' // Change to check customer dashboard
                    },
                    role: 'authenticated',
                    aud: 'authenticated',
                    created_at: new Date().toISOString()
                };

                // Return different single object based on table
                let data: any = {
                    id: mockUser.id,
                    role: mockUser.user_metadata.role,
                    full_name: mockUser.user_metadata.full_name,
                    email: mockUser.email,
                    status: 'active'
                };

                if (tableName === 'appointments') {
                    data = { id: '1', title: 'Mock Appointment 1', description: 'Test', duration: 30, price: 100, user_id: 'mock-user-1' };
                }

                return Promise.resolve({ data, error: null });
            },
            maybeSingle: () => Promise.resolve({ data: { id: 'mock-id' }, error: null }),
            then: (resolve: any) => {
                // Return array data for lists based on table
                let mockList: any[] = [];

                if (tableName === 'users' || tableName === 'organizers') {
                    mockList = [
                        { id: '1', full_name: 'Alice Admin', email: 'alice@example.com', role: 'admin', status: 'active', created_at: new Date().toISOString() },
                        { id: '2', full_name: 'Bob Organizer', email: 'bob@example.com', role: 'organizer', status: 'active', created_at: new Date().toISOString(), business_name: 'Bob Events', approved: true },
                        { id: '3', full_name: 'Charlie Customer', email: 'charlie@example.com', role: 'customer', status: 'active', created_at: new Date().toISOString() },
                        { id: '4', full_name: 'Dave Pending', email: 'dave@example.com', role: 'organizer', status: 'pending', created_at: new Date().toISOString(), business_name: 'Dave Designs', approved: false },
                    ];
                    // Filter for organizers if needed (naive since we can't see the 'eq' calls easily here without state)
                    if (tableName === 'organizers') {
                        // Just return the organizer ones
                        mockList = mockList.filter(u => u.role === 'organizer');
                    }
                } else if (tableName === 'appointments') {
                    mockList = [
                        { id: '1', title: 'Mock Appointment 1', description: 'Test description', duration: 30, price: 100, user_id: 'mock-user-1' },
                        { id: '2', title: 'Mock Appointment 2', description: 'Another test', duration: 60, price: 200, user_id: 'mock-user-1' }
                    ];
                } else if (tableName === 'bookings') {
                    mockList = [
                        { id: '1', status: 'confirmed', appointment: { title: 'Mock Appt 1' }, appointments: { title: 'Mock Appt 1' }, users: { full_name: 'Charlie Customer', email: 'charlie@example.com' }, time_slots: { slot_date: new Date().toISOString(), start_time: '10:00', end_time: '11:00' }, created_at: new Date().toISOString() }
                    ];
                } else {
                    // Default
                    mockList = [{ id: '1', name: 'Generic Item' }];
                }

                resolve({ data: mockList, count: mockList.length, error: null });
            },
        };
        return builder as any;
    };

    return {
        from: (table: string) => {
            console.log(`Mock DB call to table: ${table}`);
            return createQueryBuilder(table);
        },
        auth: {
            signUp: async (data: any) => {
                console.log('Mock Auth SignUp', data);
                return { data: { user: { id: 'mock-user-id', email: data.email } }, error: null };
            },
            signInWithPassword: async (data: any) => {
                console.log('Mock Auth SignIn', data);
                return { data: { user: { id: 'mock-user-id', email: data.email } }, error: null };
            },
            signInWithOAuth: async () => ({ data: { url: 'http://localhost:3000' }, error: null }),
            signOut: async () => ({ error: null }),
            getSession: async () => ({ data: { session: { user: { id: 'mock-user-id' } } }, error: null }),
            getUser: async () => ({ data: { user: { id: 'mock-user-id' } }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            verifyOtp: async () => ({ data: { session: {} }, error: null }),
            resetPasswordForEmail: async () => ({ data: {}, error: null }),
            updateUser: async () => ({ data: { user: {} }, error: null }),
        },
        storage: {
            from: (bucket: string) => ({
                upload: async () => ({ data: { path: 'mock/path' }, error: null }),
                getPublicUrl: (path: string) => ({ data: { publicUrl: `https://mock.url/${path}` } }),
                download: async () => ({ data: new Blob(), error: null }),
                remove: async () => ({ data: {}, error: null }),
            }),
        },
    } as any;
};
