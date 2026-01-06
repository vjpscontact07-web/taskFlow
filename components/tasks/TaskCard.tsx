'use client'

import { Task } from '@prisma/client'
import { deleteTask, updateTask } from '@/actions/tasks'
import { useTaskStore } from '@/store/useTaskStore'
import { formatDateTime } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Chip,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Tooltip
} from '@heroui/react'
import {
    Calendar,
    MoreVertical,
    Edit2,
    Trash2,
    CheckCircle2,
    Clock,
    Box
} from 'lucide-react'

interface TaskWithUser extends Task {
    user?: {
        name: string | null
        email: string
        role: string
    }
}

interface TaskCardProps {
    task: TaskWithUser
    onEdit?: (task: Task) => void
}

const priorityMap = {
    LOW: { color: 'default' as const, label: 'Low' },
    MEDIUM: { color: 'primary' as const, label: 'Medium' },
    HIGH: { color: 'warning' as const, label: 'High' },
    URGENT: { color: 'danger' as const, label: 'Urgent' },
}

const statusMap = {
    TODO: { color: 'warning' as const, label: 'To Do', icon: <Clock className="w-3 h-3" /> },
    IN_PROGRESS: { color: 'primary' as const, label: 'In Progress', icon: <Box className="w-3 h-3" /> },
    COMPLETED: { color: 'success' as const, label: 'Completed', icon: <CheckCircle2 className="w-3 h-3" /> },
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
    const { data: session } = useSession()
    const isAdmin = session?.user?.role === 'ADMIN'
    const { deleteTask: deleteTaskFromStore, updateTask: updateTaskInStore } = useTaskStore()

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this task?')) return

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

        <Card className="glass border-none shadow-sm hover:shadow-md transition-all duration-300 h-full group bg-white/40">
            {/* Header: Badges & Actions */}
            <CardHeader className="flex justify-between items-start px-5 pt-5 pb-0">
                <div className="flex items-center gap-2">
                    <Chip
                        size="sm"
                        variant="flat"
                        color={priorityMap[task.priority].color}
                        classNames={{
                            base: "h-6 px-2 bg-content1/50 border border-content1/20 shadow-sm",
                            content: "font-bold text-[10px] uppercase tracking-wider"
                        }}
                    >
                        {priorityMap[task.priority].label}
                    </Chip>
                    <Chip
                        size="sm"
                        variant="dot"
                        color={statusMap[task.status].color}
                        classNames={{
                            base: "h-6 px-2 border-none bg-transparent",
                            content: "font-semibold text-[10px]"
                        }}
                        startContent={statusMap[task.status].icon}
                    >
                        {statusMap[task.status].label}
                    </Chip>
                </div>

                <Dropdown
                    placement="bottom-end"
                    classNames={{
                        content: "bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl min-w-[160px] p-1",
                    }}
                >
                    <DropdownTrigger>
                        <Button isIconOnly variant="light" size="sm" className="text-foreground/40 hover:text-foreground transition-colors -mr-2">
                            <MoreVertical className="w-5 h-5" />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Task actions"
                        itemClasses={{
                            base: [
                                "rounded-lg",
                                "text-foreground/80",
                                "transition-opacity",
                                "data-[hover=true]:text-foreground",
                                "data-[hover=true]:bg-foreground/5",
                            ],
                        }}
                    >
                        <DropdownItem
                            key="edit"
                            startContent={<Edit2 className="w-4 h-4" />}
                            onClick={() => onEdit?.(task)}
                        >
                            Edit Task
                        </DropdownItem>
                        {isAdmin && (
                            <DropdownItem
                                key="delete"
                                className="text-danger data-[hover=true]:bg-danger/10 data-[hover=true]:text-danger mt-1"
                                startContent={<Trash2 className="w-4 h-4" />}
                                onClick={handleDelete}
                            >
                                Delete Task
                            </DropdownItem>
                        )}
                    </DropdownMenu>
                </Dropdown>
            </CardHeader>

            {/* Body: Content */}
            <CardBody className="px-5 py-4 flex-grow flex flex-col gap-3">
                <div>
                    <h3 className="text-lg font-bold tracking-tight leading-snug mb-2 text-foreground/90 group-hover:text-primary transition-colors line-clamp-2">
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className="text-foreground/60 text-sm font-medium leading-relaxed line-clamp-3">
                            {task.description}
                        </p>
                    )}
                </div>

                {task.attachment && (
                    <div className="relative group/image mt-auto pt-2">
                        <div className="absolute inset-0 top-2 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity rounded-xl z-10 flex items-center justify-center backdrop-blur-[2px]">
                            <Button
                                as="a"
                                href={task.attachment}
                                target="_blank"
                                size="sm"
                                variant="flat"
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold border border-white/40 shadow-lg"
                                radius="full"
                            >
                                View
                            </Button>
                        </div>
                        <div className="aspect-video w-full rounded-xl overflow-hidden border border-black/5 shadow-inner bg-secondary/5">
                            <img
                                src={task.attachment}
                                alt="Attachment"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110"
                            />
                        </div>
                    </div>
                )}
            </CardBody>

            {/* Footer: Meta & Status */}
            <CardFooter className="px-5 py-4 pt-2 flex flex-col gap-4 border-t border-black/5">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3 overflow-hidden">
                        {/* Due Date */}
                        <div className="flex items-center gap-1.5 text-foreground/50 font-bold text-[11px] uppercase tracking-wider shrink-0">
                            <Calendar className="w-3.5 h-3.5" />
                            {task.dueDate ? formatDateTime(task.dueDate) : 'No Date'}
                        </div>

                        {/* User Avatar (Admin Only) */}
                        {isAdmin && task.user && (
                            <Tooltip
                                content={`Owner: ${task.user.name || 'User'} (${task.user.email})`}
                                classNames={{
                                    content: "bg-white/90 backdrop-blur-xl border border-white/50 shadow-xl text-foreground font-medium rounded-xl px-3 py-2 text-xs",
                                }}
                            >
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary/5 border border-secondary/10 hover:bg-secondary/10 transition-colors cursor-help shrink-0 max-w-[120px]">
                                    <div className="w-4 h-4 rounded-full bg-secondary/20 flex items-center justify-center text-[9px] font-bold text-secondary shrink-0">
                                        {(task.user.name || task.user.email).charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-[10px] font-bold text-secondary/80 truncate">
                                        {task.user.name?.split(' ')[0] || 'User'}
                                    </span>
                                </div>
                            </Tooltip>
                        )}
                    </div>

                    <Dropdown
                        placement="top-end"
                        classNames={{
                            content: "bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl min-w-[150px] p-1",
                        }}
                    >
                        <DropdownTrigger>
                            <Button
                                size="sm"
                                variant="light"
                                className={`font-bold text-[10px] h-7 px-3 min-w-0 transition-colors ${task.status === 'COMPLETED' ? 'text-success bg-success/10 hover:bg-success/20' :
                                    task.status === 'IN_PROGRESS' ? 'text-primary bg-primary/10 hover:bg-primary/20' :
                                        'text-warning bg-warning/10 hover:bg-warning/20'
                                    }`}
                                radius="full"
                            >
                                Update
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Change Status"
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={[task.status]}
                            onAction={(key) => handleStatusChange(key as string)}
                            itemClasses={{
                                base: [
                                    "rounded-lg",
                                    "text-foreground/80",
                                    "transition-opacity",
                                    "data-[hover=true]:text-foreground",
                                    "data-[hover=true]:bg-foreground/5",
                                ],
                            }}
                        >
                            <DropdownItem key="TODO" startContent={<Clock className="w-4 h-4 text-warning" />}>To Do</DropdownItem>
                            <DropdownItem key="IN_PROGRESS" startContent={<Box className="w-4 h-4 text-primary" />}>In Progress</DropdownItem>
                            <DropdownItem key="COMPLETED" startContent={<CheckCircle2 className="w-4 h-4 text-success" />}>Completed</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </CardFooter>
        </Card>
    )
}
