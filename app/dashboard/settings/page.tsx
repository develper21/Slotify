'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { toast } from 'sonner'
import { User, Building2, Settings as SettingsIcon, Save } from 'lucide-react'

export default function SettingsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [organizer, setOrganizer] = useState<any>(null)

    // Profile form
    const [profileForm, setProfileForm] = useState({
        full_name: '',
        email: '',
        phone: '',
    })

    // Business form
    const [businessForm, setBusinessForm] = useState({
        business_name: '',
        description: '',
        website: '',
        address: '',
    })

    // Preferences form
    const [preferencesForm, setPreferencesForm] = useState({
        timezone: 'UTC',
        email_notifications: true,
        sms_notifications: false,
        default_duration: '30',
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            // Get user profile
            const { data: userData }: { data: any } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single()

            // Get organizer profile
            const { data: organizerData }: { data: any } = await supabase
                .from('organizers')
                .select('*')
                .eq('user_id', user.id)
                .single()

            setUser(userData)
            setOrganizer(organizerData)

            // Set form values
            if (userData) {
                setProfileForm({
                    full_name: userData.full_name || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                })
            }

            if (organizerData) {
                setBusinessForm({
                    business_name: organizerData.business_name || '',
                    description: organizerData.description || '',
                    website: organizerData.website || '',
                    address: organizerData.address || '',
                })

                setPreferencesForm({
                    timezone: organizerData.timezone || 'UTC',
                    email_notifications: organizerData.email_notifications ?? true,
                    sms_notifications: organizerData.sms_notifications ?? false,
                    default_duration: organizerData.default_duration || '30',
                })
            }
        } catch (error) {
            console.error('Error loading data:', error)
            toast.error('Failed to load settings')
        } finally {
            setLoading(false)
        }
    }

    const handleSaveProfile = async () => {
        setSaving(true)
        try {
            const supabase = createClient()
            const { error } = await (supabase
                .from('users')
                .update as any)({
                    full_name: profileForm.full_name,
                    phone: profileForm.phone,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id)

            if (error) throw error

            toast.success('Profile updated successfully')
            loadData()
        } catch (error) {
            toast.error('Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    const handleSaveBusiness = async () => {
        setSaving(true)
        try {
            const supabase = createClient()
            const { error } = await (supabase
                .from('organizers')
                .update as any)({
                    business_name: businessForm.business_name,
                    description: businessForm.description,
                    website: businessForm.website,
                    address: businessForm.address,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', organizer.id)

            if (error) throw error

            toast.success('Business settings updated successfully')
            loadData()
        } catch (error) {
            toast.error('Failed to update business settings')
        } finally {
            setSaving(false)
        }
    }

    const handleSavePreferences = async () => {
        setSaving(true)
        try {
            const supabase = createClient()
            const { error } = await (supabase
                .from('organizers')
                .update as any)({
                    timezone: preferencesForm.timezone,
                    email_notifications: preferencesForm.email_notifications,
                    sms_notifications: preferencesForm.sms_notifications,
                    default_duration: preferencesForm.default_duration,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', organizer.id)

            if (error) throw error

            toast.success('Preferences updated successfully')
            loadData()
        } catch (error) {
            toast.error('Failed to update preferences')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse text-white">
                <div className="h-8 bg-neutral-800 rounded w-1/4" />
                <div className="h-64 bg-neutral-800 rounded" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-white mb-2">
                    Settings
                </h1>
                <p className="text-neutral-400">
                    Manage your account and business settings
                </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="profile">
                <TabsList className="mb-6 bg-mongodb-slate/50 border-neutral-800">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-mongodb-black data-[state=active]:text-mongodb-spring">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="business" className="data-[state=active]:bg-mongodb-black data-[state=active]:text-mongodb-spring">
                        <Building2 className="w-4 h-4 mr-2" />
                        Business
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="data-[state=active]:bg-mongodb-black data-[state=active]:text-mongodb-spring">
                        <SettingsIcon className="w-4 h-4 mr-2" />
                        Preferences
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card className="bg-mongodb-slate/30 border-neutral-800">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <User className="w-6 h-6 text-mongodb-spring" />
                                <CardTitle className="text-white">Profile Settings</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                label="Full Name"
                                value={profileForm.full_name}
                                onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                                placeholder="Enter your full name"
                                className="bg-mongodb-black border-neutral-700 text-white focus:border-mongodb-spring"
                                labelClassName="text-neutral-400"
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={profileForm.email}
                                disabled
                                placeholder="Your email address"
                                className="bg-neutral-900 border-neutral-800 text-neutral-400 cursor-not-allowed"
                                labelClassName="text-neutral-400"
                            />
                            <Input
                                label="Phone"
                                type="tel"
                                value={profileForm.phone}
                                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                placeholder="Enter your phone number"
                                className="bg-mongodb-black border-neutral-700 text-white focus:border-mongodb-spring"
                                labelClassName="text-neutral-400"
                            />
                            <Button onClick={handleSaveProfile} isLoading={saving} variant="primary">
                                <Save className="w-4 h-4 mr-2" />
                                Save Profile
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="business">
                    <Card className="bg-mongodb-slate/30 border-neutral-800">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Building2 className="w-6 h-6 text-mongodb-spring" />
                                <CardTitle className="text-white">Business Settings</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                label="Business Name"
                                value={businessForm.business_name}
                                onChange={(e) => setBusinessForm({ ...businessForm, business_name: e.target.value })}
                                placeholder="Enter your business name"
                                className="bg-mongodb-black border-neutral-700 text-white focus:border-mongodb-spring"
                                labelClassName="text-neutral-400"
                            />
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={businessForm.description}
                                    onChange={(e) => setBusinessForm({ ...businessForm, description: e.target.value })}
                                    placeholder="Describe your business"
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:outline-none focus:border-mongodb-spring placeholder:text-neutral-600"
                                />
                            </div>
                            <Input
                                label="Website"
                                type="url"
                                value={businessForm.website}
                                onChange={(e) => setBusinessForm({ ...businessForm, website: e.target.value })}
                                placeholder="https://example.com"
                                className="bg-mongodb-black border-neutral-700 text-white focus:border-mongodb-spring"
                                labelClassName="text-neutral-400"
                            />
                            <Input
                                label="Address"
                                value={businessForm.address}
                                onChange={(e) => setBusinessForm({ ...businessForm, address: e.target.value })}
                                placeholder="Enter your business address"
                                className="bg-mongodb-black border-neutral-700 text-white focus:border-mongodb-spring"
                                labelClassName="text-neutral-400"
                            />
                            <Button onClick={handleSaveBusiness} isLoading={saving} variant="primary">
                                <Save className="w-4 h-4 mr-2" />
                                Save Business Settings
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="preferences">
                    <Card className="bg-mongodb-slate/30 border-neutral-800">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <SettingsIcon className="w-6 h-6 text-mongodb-spring" />
                                <CardTitle className="text-white">Preferences</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-2">
                                    Timezone
                                </label>
                                <select
                                    value={preferencesForm.timezone}
                                    onChange={(e) => setPreferencesForm({ ...preferencesForm, timezone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:outline-none focus:border-mongodb-spring"
                                >
                                    <option value="UTC">UTC</option>
                                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                    <option value="America/New_York">America/New_York (EST)</option>
                                    <option value="Europe/London">Europe/London (GMT)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-2">
                                    Default Appointment Duration
                                </label>
                                <select
                                    value={preferencesForm.default_duration}
                                    onChange={(e) => setPreferencesForm({ ...preferencesForm, default_duration: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:outline-none focus:border-mongodb-spring"
                                >
                                    <option value="15">15 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">1 hour</option>
                                    <option value="90">1.5 hours</option>
                                    <option value="120">2 hours</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={preferencesForm.email_notifications}
                                            onChange={(e) => setPreferencesForm({ ...preferencesForm, email_notifications: e.target.checked })}
                                            className="peer sr-only"
                                        />
                                        <div className="w-10 h-6 bg-neutral-700 rounded-full peer-checked:bg-mongodb-spring transition-colors"></div>
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                                    </div>
                                    <span className="text-sm text-neutral-400 group-hover:text-white transition-colors">Enable email notifications</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={preferencesForm.sms_notifications}
                                            onChange={(e) => setPreferencesForm({ ...preferencesForm, sms_notifications: e.target.checked })}
                                            className="peer sr-only"
                                        />
                                        <div className="w-10 h-6 bg-neutral-700 rounded-full peer-checked:bg-mongodb-spring transition-colors"></div>
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                                    </div>
                                    <span className="text-sm text-neutral-400 group-hover:text-white transition-colors">Enable SMS notifications</span>
                                </label>
                            </div>

                            <Button onClick={handleSavePreferences} isLoading={saving} variant="primary">
                                <Save className="w-4 h-4 mr-2" />
                                Save Preferences
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
