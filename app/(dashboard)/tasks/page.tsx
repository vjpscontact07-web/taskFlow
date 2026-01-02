

'use client'

import { useEffect, useState } from 'react'
import { Task } from '@prisma/client'
import { getTasks } from '@/actions/tasks'
import { useTaskStore } from '@/store/useTaskStore'
import TaskCard from '@/components/tasks/TaskCard'
import TaskForm from '@/components/tasks/TaskForm'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'

export default function TasksPage() {
    const [showForm, setShowForm] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | undefined>()
    const [isLoading, setIsLoading] = useState(true)
    const { tasks, setTasks } = useTaskStore()

    useEffect(() => {
        loadTasks()
    }, [])

    const loadTasks = async () => {
        setIsLoading(true)
        try {
            const result = await getTasks()
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
        loadTasks()
    }

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">My Tasks</h2>
                    <button
                        onClick={() => {
                            setEditingTask(undefined)
                            setShowForm(!showForm)
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {showForm ? 'Cancel' : '+ New Task'}
                    </button>
                </div>

                {/* Task Form */}
                {showForm && (
                    <div className="mb-8 bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingTask ? 'Edit Task' : 'Create New Task'}
                        </h3>
                        <TaskForm task={editingTask} onSuccess={handleFormSuccess} />
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading tasks...</p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && tasks.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No tasks yet. Create your first task!</p>
                    </div>
                )}

                {/* Task Grid */}
                {!isLoading && tasks.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} onEdit={handleEdit} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
