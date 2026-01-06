'use client'

import { useEffect, useState } from 'react'
import { getAllUsers, updateUserRole, deleteUser } from '@/actions/admin'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    User as HeroUser,
    Chip,
    Tooltip,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Spinner,
    Card,
    CardBody
} from '@heroui/react'
import { Shield, ShieldAlert, Trash2, MoreVertical, Check, X, Users } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchUsers = async () => {
        setLoading(true)
        const result = await getAllUsers()
        if (result.success && result.data) {
            setUsers(result.data)
        } else {
            toast.error(result.error || "Failed to fetch users")
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleRoleChange = async (userId: string, newRole: 'ADMIN' | 'USER') => {
        const result = await updateUserRole(userId, newRole)
        if (result.success) {
            toast.success(result.message || "User role updated")
            fetchUsers()
        } else {
            toast.error(result.error || "Failed to update role")
        }
    }

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? All their tasks will be permanently removed.")) return

        const result = await deleteUser(userId)
        if (result.success) {
            toast.success(result.message || "User deleted")
            fetchUsers()
        } else {
            toast.error(result.error || "Failed to delete user")
        }
    }

    if (loading && users.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" label="Loading users..." color="secondary" />
            </div>
        )
    }

    return (
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                <p className="text-foreground/60 mt-2">Manage user permissions and account status.</p>
            </div>

            <Card className="glass border-none shadow-xl overflow-hidden">
                <CardBody className="p-0">
                    <Table
                        aria-label="User Management Table"
                        className="border-none"
                        removeWrapper
                    >
                        <TableHeader>
                            <TableColumn className="bg-black/5 dark:bg-white/5 px-8 py-4">User</TableColumn>
                            <TableColumn className="bg-black/5 dark:bg-white/5 px-8 py-4">Role</TableColumn>
                            <TableColumn className="bg-black/5 dark:bg-white/5 px-8 py-4">Tasks</TableColumn>
                            <TableColumn className="bg-black/5 dark:bg-white/5 px-8 py-4">Joined</TableColumn>
                            <TableColumn className="bg-black/5 dark:bg-white/5 px-8 py-4 text-center">Actions</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={"No users found"} isLoading={loading} loadingContent={<Spinner color="secondary" />}>
                            {users.map((user) => (
                                <TableRow key={user.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                                    <TableCell className="px-8 py-5">
                                        <HeroUser
                                            avatarProps={{ radius: "lg", src: user.image || "" }}
                                            description={user.email}
                                            name={user.name}
                                        >
                                            {user.email}
                                        </HeroUser>
                                    </TableCell>
                                    <TableCell className="px-8 py-5">
                                        <Chip
                                            className="capitalize"
                                            color={user.role === "ADMIN" ? "secondary" : "default"}
                                            size="sm"
                                            variant="flat"
                                            startContent={user.role === "ADMIN" ? <Shield size={12} className="ml-1" /> : <Users size={12} className="ml-1" />}
                                        >
                                            {user.role}
                                        </Chip>
                                    </TableCell>
                                    <TableCell className="px-8 py-5 font-bold">
                                        {user.taskCount}
                                    </TableCell>
                                    <TableCell className="px-8 py-5 text-foreground/60 text-sm">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="px-8 py-5">
                                        <div className="relative flex justify-center items-center gap-2">
                                            <Dropdown
                                                classNames={{
                                                    content: "bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl min-w-[160px] p-1",
                                                }}
                                            >
                                                <DropdownTrigger>
                                                    <Button isIconOnly size="sm" variant="light">
                                                        <MoreVertical className="text-default-300" />
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu
                                                    aria-label="Action menu"
                                                    itemClasses={{
                                                        base: [
                                                            "rounded-lg",
                                                            "text-foreground/80",
                                                            "transition-opacity",
                                                            "data-[hover=true]:text-foreground",
                                                            "data-[hover=true]:bg-foreground/5",
                                                            "dark:data-[hover=true]:bg-white/10",
                                                        ],
                                                    }}
                                                >
                                                    <DropdownItem
                                                        key="change-role"
                                                        startContent={user.role === 'ADMIN' ? <Users size={16} /> : <Shield size={16} />}
                                                        onClick={() => handleRoleChange(user.id, user.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                                                    >
                                                        {user.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        key="delete"
                                                        className="text-danger data-[hover=true]:bg-danger/10 data-[hover=true]:text-danger mt-1"
                                                        color="danger"
                                                        startContent={<Trash2 size={16} />}
                                                        onClick={() => handleDelete(user.id)}
                                                    >
                                                        Delete User
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20 flex items-start gap-4">
                <ShieldAlert className="text-secondary shrink-0 mt-1" />
                <div>
                    <p className="text-sm font-bold text-secondary uppercase tracking-widest mb-1">Administrative Privileges</p>
                    <p className="text-sm">As an administrator, you have the power to view all tasks and manage user accounts. Please exercise caution when deleting users, as this action is irreversible.</p>
                </div>
            </div>
        </div>
    )
}
