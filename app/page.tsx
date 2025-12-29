import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

export default async function RootPage() {
    return (
        <div className="min-h-screen bg-mongodb-black flex flex-col items-center justify-center p-4">
            <h1 className="text-6xl font-display font-bold text-white mb-4">
                SLOT<span className="gradient-text">IFY</span>
            </h1>
            <p className="text-neutral-400 text-xl mb-12 text-center max-w-lg">
                Manual Route Access Mode Enabled. Choose your destination:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                <Link href="/login" className="w-full">
                    <Button variant="outline" className="w-full py-8 text-lg border-neutral-700 hover:bg-neutral-800">
                        Authentication (Login)
                    </Button>
                </Link>
                <Link href="/signup" className="w-full">
                    <Button variant="outline" className="w-full py-8 text-lg border-neutral-700 hover:bg-neutral-800">
                        Authentication (Signup)
                    </Button>
                </Link>
                <Link href="/dashboard" className="w-full">
                    <Button className="w-full py-8 text-lg bg-mongodb-spring text-mongodb-black hover:bg-mongodb-spring/90">
                        Organizer Dashboard
                    </Button>
                </Link>
                <Link href="/dashboard?role=admin" className="w-full">
                    <Button className="w-full py-8 text-lg bg-purple-500 hover:bg-purple-600 text-white">
                        Admin Dashboard
                    </Button>
                </Link>
                <Link href="/dashboard?role=customer" className="w-full text-center md:col-span-2">
                    <Button className="w-full py-8 text-lg bg-blue-500 hover:bg-blue-600 text-white">
                        Customer Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    )
}
