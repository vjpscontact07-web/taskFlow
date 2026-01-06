'use client'

import { useEffect, useState } from 'react'
import { getAdminStats } from '@/actions/admin'
import { Card, CardBody, CardHeader, Divider, Chip, Spinner, Button } from '@heroui/react'
import { Users, CheckSquare, Clock, AlertTriangle, ArrowUpRight, Plus, LogOut } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { signOut } from 'next-auth/react'

interface Stats {
    totalUsers: number
    totalTasks: number
    tasksByStatus: Record<string, number>
    recentTasks: any[]
}

export default function AdminOverview() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadStats() {
            const result = await getAdminStats()
            if (result.success && result.data) {
                setStats(result.data)
            } else {
                toast.error(result.error || "Failed to load admin statistics")
            }
            setLoading(false)
        }
        loadStats()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" label="Loading dashboard stats..." color="primary" />
            </div>
        )
    }

    if (!stats) return null

    const statCards = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: <Users className="text-blue-500" />,
            color: "blue"
        },
        {
            title: "Total Tasks",
            value: stats.totalTasks,
            icon: <CheckSquare className="text-green-500" />,
            color: "green"
        },
        {
            title: "In Progress",
            value: stats.tasksByStatus['IN_PROGRESS'] || 0,
            icon: <Clock className="text-orange-500" />,
            color: "orange"
        },
        {
            title: "Pending (Todo)",
            value: stats.tasksByStatus['TODO'] || 0,
            icon: <AlertTriangle className="text-yellow-500" />,
            color: "yellow"
        }
    ]

    return (
        <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
                    <p className="text-foreground/60 mt-2">Global metrics across all TaskFlow users.</p>
                </div>
                <Button as={Link} href="/admin/users" variant="flat" color="secondary" endContent={<ArrowUpRight size={18} />}>
                    Manage Users
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <Card key={i} className="glass border-none shadow-md hover:translate-y-[-4px] transition-transform">
                        <CardBody className="flex flex-row items-center gap-6 p-6">
                            <div className="w-14 h-14 rounded-2xl bg-white/50 dark:bg-black/20 flex items-center justify-center shadow-sm text-2xl">
                                {stat.icon}
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm font-semibold text-foreground/50 uppercase tracking-wider">{stat.title}</p>
                                <p className="text-4xl font-extrabold">{stat.value}</p>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 glass border-none shadow-md overflow-hidden">
                    <CardHeader className="flex justify-between items-center px-8 py-6">
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold">Recent Tasks</h2>
                            <p className="text-sm text-foreground/50">Automatically updated with the latest assignments.</p>
                        </div>
                        <Button size="sm" variant="light" as={Link} href="/tasks">View All</Button>
                    </CardHeader>
                    <Divider />
                    <CardBody className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-black/5 dark:bg-white/5 text-xs font-bold uppercase tracking-wider text-foreground/50">
                                    <tr>
                                        <th className="px-8 py-4">Task Name</th>
                                        <th className="px-8 py-4">Owner</th>
                                        <th className="px-8 py-4">Status</th>
                                        <th className="px-8 py-4 text-right">Date Created</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {stats.recentTasks.map((task, i) => (
                                        <tr key={task.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                                            <td className="px-8 py-5">
                                                <p className="font-bold group-hover:text-primary transition-colors">{task.title}</p>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <Chip size="sm" variant="bordered" color="default">{task.owner}</Chip>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <Chip
                                                    size="sm"
                                                    variant="dot"
                                                    color={task.status === 'COMPLETED' ? 'success' : task.status === 'IN_PROGRESS' ? 'warning' : 'default'}
                                                >
                                                    {task.status}
                                                </Chip>
                                            </td>
                                            <td className="px-8 py-5 text-right text-sm text-foreground/60 font-medium">
                                                {new Date(task.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>

                <Card className="glass border-none shadow-md">
                    <CardHeader className="flex flex-col items-start px-8 py-6">
                        <h2 className="text-xl font-bold">Quick Actions</h2>
                        <p className="text-sm text-foreground/50">Standard operations for administrators.</p>
                    </CardHeader>
                    <Divider />
                    <CardBody className="p-8 space-y-4">
                        <Button fullWidth color="secondary" variant="shadow" className="h-12 font-bold" as={Link} href="/admin/users">
                            User Management
                        </Button>
                        <Button
                            fullWidth
                            color="danger"
                            variant="flat"
                            className="h-12 font-bold"
                            startContent={<LogOut size={18} />}
                            onClick={() => signOut({ callbackUrl: '/' })}
                        >
                            Log Out
                        </Button>
                        <div className="mt-8 p-4 rounded-2xl bg-warning/10 border border-warning/20">
                            <p className="text-xs font-bold uppercase text-warning tracking-widest mb-2">System Alert</p>
                            <p className="text-sm font-medium">RBAC mode is currently active. All administrative actions are logged in the audit trail.</p>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}
