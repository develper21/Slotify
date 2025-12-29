import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getAllOrganizers } from '@/lib/actions/admin'
import { DataTable } from '@/components/ui/DataTable'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Building2, CheckCircle, XCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ApprovalActions, DisableButton } from '@/components/admin/OrganizerActions'

export const dynamic = 'force-dynamic'

export default async function AdminOrganizersPage() {
    const session = await getSession()

    if (!session || session.user.role !== 'admin') {
        redirect('/dashboard')
    }

    const organizers = await getAllOrganizers()

    const stats = {
        total: organizers.length,
        approved: organizers.filter((o: any) => o.status === 'active').length,
        pending: organizers.filter((o: any) => o.status === 'pending').length,
    }

    const pendingOrganizers = organizers.filter((o: any) => o.status === 'pending')
    const approvedOrganizers = organizers.filter((o: any) => o.status === 'active')

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">
                    Organizer Management
                </h1>
                <p className="text-neutral-400">
                    Approve and manage organizers
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-400 mb-1">Total Organizers</p>
                                <p className="text-2xl font-bold text-white">{stats.total}</p>
                            </div>
                            <Building2 className="w-10 h-10 text-mongodb-spring/20" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-400 mb-1">Approved</p>
                                <p className="text-2xl font-bold text-green-500">{stats.approved}</p>
                            </div>
                            <CheckCircle className="w-10 h-10 text-green-500/20" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-400 mb-1">Pending Approval</p>
                                <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
                            </div>
                            <Clock className="w-10 h-10 text-yellow-500/20" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {pendingOrganizers.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">
                        Pending Approvals ({pendingOrganizers.length})
                    </h2>
                    <DataTable
                        data={pendingOrganizers}
                        columns={[
                            {
                                key: 'businessName',
                                header: 'Business Name',
                                render: (org: any) => (
                                    <div>
                                        <p className="font-medium text-white">{org.businessName || 'No Business Name'}</p>
                                        <p className="text-xs text-neutral-400">{org.fullName}</p>
                                    </div>
                                ),
                                sortable: true
                            },
                            {
                                key: 'email',
                                header: 'Email',
                                render: (org: any) => <span className="text-neutral-300">{org.email || 'N/A'}</span>
                            },
                            {
                                key: 'businessDescription',
                                header: 'Description',
                                render: (org: any) => (
                                    <p className="text-sm text-neutral-400 line-clamp-2">
                                        {org.businessDescription || 'No description'}
                                    </p>
                                )
                            },
                            {
                                key: 'createdAt',
                                header: 'Applied',
                                render: (org: any) => <span className="text-neutral-300">{org.createdAt ? format(new Date(org.createdAt), 'MMM d, yyyy') : 'N/A'}</span>,
                                sortable: true
                            }
                        ]}
                        keyExtractor={(org: any) => org.id}
                        actions={(org: any) => (
                            <ApprovalActions organizerId={org.id} />
                        )}
                        emptyMessage="No pending approvals"
                        pageSize={10}
                    />
                </div>
            )}

            <div>
                <h2 className="text-xl font-semibold text-white mb-4">
                    Approved Organizers ({approvedOrganizers.length})
                </h2>
                <DataTable
                    data={approvedOrganizers}
                    columns={[
                        {
                            key: 'businessName',
                            header: 'Business Name',
                            render: (org: any) => (
                                <div>
                                    <p className="font-medium text-white">{org.businessName || 'No Business Name'}</p>
                                    <p className="text-xs text-neutral-400">{org.fullName}</p>
                                </div>
                            ),
                            sortable: true
                        },
                        {
                            key: 'email',
                            header: 'Email',
                            render: (org: any) => <span className="text-neutral-300">{org.email || 'N/A'}</span>
                        },
                        {
                            key: 'status',
                            header: 'Status',
                            render: (org: any) => (
                                <Badge variant={org.status === 'active' ? 'success' : 'default'}>
                                    {org.status || 'active'}
                                </Badge>
                            )
                        },
                        {
                            key: 'websiteUrl',
                            header: 'Website',
                            render: (org: any) => org.websiteUrl ? (
                                <a href={org.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-mongodb-spring hover:underline text-sm">
                                    Visit
                                </a>
                            ) : 'N/A'
                        },
                        {
                            key: 'createdAt',
                            header: 'Joined',
                            render: (org: any) => <span className="text-neutral-300">{org.createdAt ? format(new Date(org.createdAt), 'MMM d, yyyy') : 'N/A'}</span>,
                            sortable: true
                        }
                    ]}
                    keyExtractor={(org: any) => org.id}
                    actions={(org: any) => (
                        <DisableButton organizerId={org.id} />
                    )}
                    emptyMessage="No approved organizers"
                    pageSize={15}
                />
            </div>
        </div>
    )
}
