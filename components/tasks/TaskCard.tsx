

'use client'

import { Task } from '@prisma/client'
import { deleteTask, updateTask } from '@/actions/tasks'
import { useTaskStore } from '@/store/useTaskStore'
import { formatDateTime } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useState } from 'react'

interface TaskCardProps {
    task: Task
    onEdit?: (task: Task) => void
}

const priorityColors = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-blue-100 text-blue-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
}

const statusColors = {
    TODO: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const { deleteTask: deleteTaskFromStore, updateTask: updateTaskInStore } = useTaskStore()

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this task?')) return

        setIsDeleting(true)

        try {
            const result = await deleteTask(task.id)

            if (result.success) {
                deleteTaskFromStore(task.id)
                toast.success('Task deleted')
            } else {
                toast.error(result.error || 'Failed to delete')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleStatusChange = async (newStatus: string) => {
        try {
            const result = await updateTask(task.id, { status: newStatus as any })

            if (result.success && result.data) {
                updateTaskInStore(task.id, result.data)
                toast.success('Status updated')
            } else {
                toast.error(result.error || 'Failed to update')
            }
        } catch (error) {
            toast.error('An error occurred')
        }
    }

    return (
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    {task.description && (
                        <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                    )}
                </div>

                <div className="flex gap-2 ml-4">
                    <button
                        onClick={() => onEdit?.(task)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                    {task.priority}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                    {task.status.replace('_', ' ')}
                </span>
            </div>

            {task.dueDate && (
                <p className="mt-2 text-sm text-gray-500">
                    Due: {formatDateTime(task.dueDate)}
                </p>
            )}

            {task.attachment && (
                <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">Attachment:</p>
                    <a
                        href={task.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block w-full h-32 bg-gray-100 rounded-md overflow-hidden"
                    >
                        <img
                            src={task.attachment}
                            alt="Task attachment"
                            className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                            <span className="text-white text-xs font-semibold bg-black/40 px-2 py-1 rounded">View Full Image</span>
                        </div>
                    </a>
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                    Quick Status Change:
                </label>
                <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                </select>
            </div>
        </div>
    )
}
