'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { toast } from 'sonner'
import { User, Building2, Settings as SettingsIcon, Save } from 'lucide-react'
import { getCurrentUser, updateProfile, updateOrganizerSettings } from '@/lib/actions/auth'

export default function SettingsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState<any>(null)

    const [profileForm, setProfileForm] = useState({
        fullName: '',
        email: '',
        phone: '',
    })

    const [businessForm, setBusinessForm] = useState({
        businessName: '',
        businessDescription: '',
        websiteUrl: '',
        address: '',
    })

    const [preferencesForm, setPreferencesForm] = useState({
        timezone: 'UTC',
        emailNotifications: true,
        smsNotifications: false,
        defaultDuration: '30',
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const userData = await getCurrentUser()

            if (!userData) {
                router.push('/login')
                return
            }

            setUser(userData)

            setProfileForm({
                fullName: userData.fullName || '',
                email: userData.email || '',
                phone: '', // Phone field was not in schema previously, added to profiles
            })

            setBusinessForm({
                businessName: userData.businessName || '',
                businessDescription: userData.businessDescription || '',
                websiteUrl: userData.websiteUrl || '',
                address: '', // Address field not in profiles schema, maybe use businessDescription or skip
            })

            setPreferencesForm({
                timezone: userData.timezone || 'UTC',
                emailNotifications: userData.emailNotifications ?? true,
                smsNotifications: userData.smsNotifications ?? false,
                defaultDuration: (userData.defaultDuration || 30).toString(),
            })
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
            const result = await updateProfile(user.id, {
                fullName: profileForm.fullName,
            })

            if (!result.success) throw new Error(result.message)

            toast.success('Profile updated successfully')
            loadData()
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    const handleSaveBusiness = async () => {
        setSaving(true)
        try {
            const result = await updateOrganizerSettings(user.id, {
                businessName: businessForm.businessName,
                businessDescription: businessForm.businessDescription,
                websiteUrl: businessForm.websiteUrl,
            })

            if (!result.success) throw new Error(result.message)

            toast.success('Business settings updated successfully')
            loadData()
        } catch (error: any) {
            toast.error(error.message || 'Failed to update business settings')
        } finally {
            setSaving(false)
        }
    }

    const handleSavePreferences = async () => {
        setSaving(true)
        try {
            const result = await updateOrganizerSettings(user.id, {
                timezone: preferencesForm.timezone,
                emailNotifications: preferencesForm.emailNotifications,
                smsNotifications: preferencesForm.smsNotifications,
                defaultDuration: parseInt(preferencesForm.defaultDuration),
            })

            if (!result.success) throw new Error(result.message)

            toast.success('Preferences updated successfully')
            loadData()
        } catch (error: any) {
            toast.error(error.message || 'Failed to update preferences')
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

    const isOrganizer = user?.role === 'organizer' || user?.role === 'admin'

    return (
        <div className="max-w-4xl animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-white mb-2">
                    Settings
                </h1>
                <p className="text-neutral-400">
                    Manage your account and business settings
                </p>
            </div>

            <Tabs defaultValue="profile">
                <TabsList className="mb-6 bg-mongodb-slate/50 border-neutral-800">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-mongodb-black data-[state=active]:text-mongodb-spring">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                    </TabsTrigger>
                    {isOrganizer && (
                        <>
                            <TabsTrigger value="business" className="data-[state=active]:bg-mongodb-black data-[state=active]:text-mongodb-spring">
                                <Building2 className="w-4 h-4 mr-2" />
                                Business
                            </TabsTrigger>
                            <TabsTrigger value="preferences" className="data-[state=active]:bg-mongodb-black data-[state=active]:text-mongodb-spring">
                                <SettingsIcon className="w-4 h-4 mr-2" />
                                Preferences
                            </TabsTrigger>
                        </>
                    )}
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
                                value={profileForm.fullName}
                                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
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

                {isOrganizer && (
                    <>
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
                                        value={businessForm.businessName}
                                        onChange={(e) => setBusinessForm({ ...businessForm, businessName: e.target.value })}
                                        placeholder="Enter your business name"
                                        className="bg-mongodb-black border-neutral-700 text-white focus:border-mongodb-spring"
                                        labelClassName="text-neutral-400"
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-400 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={businessForm.businessDescription}
                                            onChange={(e) => setBusinessForm({ ...businessForm, businessDescription: e.target.value })}
                                            placeholder="Describe your business"
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:outline-none focus:border-mongodb-spring placeholder:text-neutral-600"
                                        />
                                    </div>
                                    <Input
                                        label="Website"
                                        type="url"
                                        value={businessForm.websiteUrl}
                                        onChange={(e) => setBusinessForm({ ...businessForm, websiteUrl: e.target.value })}
                                        placeholder="https://example.com"
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
                                            className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:outline-none focus:border-mongodb-spring">
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
                                            value={preferencesForm.defaultDuration}
                                            onChange={(e) => setPreferencesForm({ ...preferencesForm, defaultDuration: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:outline-none focus:border-mongodb-spring">
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
                                                    checked={preferencesForm.emailNotifications}
                                                    onChange={(e) => setPreferencesForm({ ...preferencesForm, emailNotifications: e.target.checked })}
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
                                                    checked={preferencesForm.smsNotifications}
                                                    onChange={(e) => setPreferencesForm({ ...preferencesForm, smsNotifications: e.target.checked })}
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
                    </>
                )}
            </Tabs>
        </div>
    )
}
