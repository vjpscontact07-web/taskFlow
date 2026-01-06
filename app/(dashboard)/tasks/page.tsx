'use client'

import { useEffect, useState } from 'react'
import { Task } from '@prisma/client'
import { getTasks } from '@/actions/tasks'
import { useTaskStore } from '@/store/useTaskStore'
import TaskCard from '@/components/tasks/TaskCard'
import TaskForm from '@/components/tasks/TaskForm'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { Select, SelectItem, Spinner, Button } from '@heroui/react'
import { getAllUsers } from '@/actions/admin'
import { RefreshCw, Users, LayoutGrid } from 'lucide-react'

export default function TasksPage() {
    const { data: session } = useSession()
    const isAdmin = session?.user?.role === 'ADMIN'

    const [showForm, setShowForm] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | undefined>()
    const [isLoading, setIsLoading] = useState(true)
    const [selectedUserId, setSelectedUserId] = useState<string>('all')
    const [usersList, setUsersList] = useState<any[]>([])
    const { tasks, setTasks } = useTaskStore()

    useEffect(() => {
        if (isAdmin) {
            fetchUsers()
        }
        loadTasks(selectedUserId === 'all' ? undefined : selectedUserId)
    }, [isAdmin, selectedUserId])

    const fetchUsers = async () => {
        const result = await getAllUsers()
        if (result.success && result.data) {
            setUsersList(result.data)
        }
    }

    const loadTasks = async (userId?: string) => {
        setIsLoading(true)
        try {
            const result = await getTasks(userId)
            if (result.success && result.data) {
                setTasks(result.data)
            } else {
                toast.error(result.error || 'Failed to load tasks')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = (task: Task) => {
        setEditingTask(task)
        setShowForm(true)
    }

    const handleFormSuccess = () => {
        setShowForm(false)
        setEditingTask(undefined)
        loadTasks(selectedUserId === 'all' ? undefined : selectedUserId)
    }

    return (
        <div className="min-h-screen">
            <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-24">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between glass-panel p-6 rounded-3xl">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            {isAdmin ? 'Global Tasks' : 'My Tasks'}
                        </h2>
                        <p className="text-sm text-foreground/60 sm:text-base">
                            {isAdmin
                                ? 'Overview of all tasks across the system'
                                : 'Manage and track your personal productivity'}
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:w-auto">
                        {isAdmin && (
                            <Select
                                size="sm"
                                label="Filter by user"
                                className="w-full sm:w-56"
                                selectedKeys={[selectedUserId]}
                                onSelectionChange={(keys) =>
                                    setSelectedUserId(Array.from(keys)[0] as string)
                                }
                                variant="flat"
                                popoverProps={{
                                    classNames: {
                                        content: "bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl p-1",
                                    }
                                }}
                                listboxProps={{
                                    itemClasses: {
                                        base: [
                                            "rounded-lg",
                                            "text-foreground/80",
                                            "transition-opacity",
                                            "data-[hover=true]:text-foreground",
                                            "data-[hover=true]:bg-foreground/5",
                                            "dark:data-[hover=true]:bg-white/10",
                                        ],
                                    }
                                }}
                                items={[
                                    { id: 'all', name: 'All Users', email: '', startContent: <LayoutGrid size={16} /> },
                                    ...usersList.map((u: any) => ({
                                        id: u.id,
                                        name: u.name || u.email,
                                        email: u.email,
                                        startContent: undefined
                                    }))
                                ]}
                            >
                                {(item) => (
                                    <SelectItem
                                        key={item.id}
                                        textValue={item.name}
                                        startContent={item.startContent}
                                    >
                                        {item.name}
                                    </SelectItem>
                                )}
                            </Select>
                        )}

                        <div className="flex w-full items-center gap-3 sm:w-auto">
                            <button
                                onClick={() => {
                                    setEditingTask(undefined)
                                    setShowForm((prev) => !prev)
                                }}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl active:scale-95 sm:flex-none sm:px-6 sm:text-base"
                            >
                                {showForm ? (
                                    'Cancel'
                                ) : (
                                    <>
                                        <span className="text-lg leading-none">+</span>
                                        <span>New Task</span>
                                    </>
                                )}
                            </button>

                            <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                className="h-10 w-10 rounded-xl border border-black/5 bg-white shadow-sm"
                                onClick={() =>
                                    loadTasks(selectedUserId === 'all' ? undefined : selectedUserId)
                                }
                            >
                                <RefreshCw
                                    size={18}
                                    className={isLoading ? 'animate-spin' : ''}
                                />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Task Form */}
                {showForm && (
                    <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm sm:mb-8 sm:p-6">
                        <h3 className="mb-4 text-base font-semibold tracking-tight sm:text-lg">
                            {editingTask ? 'Edit Task' : 'Create New Task'}
                        </h3>
                        <TaskForm task={editingTask} onSuccess={handleFormSuccess} />
                    </section>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-16">
                        <Spinner label="Loading tasks..." color="primary" />
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && tasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white py-12 text-center text-sm text-gray-500 sm:text-base">
                        <p>No tasks yet. Create your first task!</p>
                    </div>
                )}

                {/* Task Grid */}
                {!isLoading && tasks.length > 0 && (
                    <section
                        className="
              grid gap-4
              sm:gap-5
              md:grid-cols-2
              lg:grid-cols-3
            "
                    >
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} onEdit={handleEdit} />
                        ))}
                    </section>
                )}
            </main>
        </div>
    )
}
