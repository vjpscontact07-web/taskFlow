

import { create } from 'zustand'
import { Task } from '@prisma/client'

interface TaskStore {
    tasks: Task[]
    isLoading: boolean
    error: string | null

    // Actions
    setTasks: (tasks: Task[]) => void
    addTask: (task: Task) => void
    updateTask: (id: string, task: Partial<Task>) => void
    deleteTask: (id: string) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
}

export const useTaskStore = create<TaskStore>((set) => ({
    tasks: [],
    isLoading: false,
    error: null,

    setTasks: (tasks) => set({ tasks }),

    addTask: (task) => set((state) => ({
        tasks: [...state.tasks, task]
    })),

    updateTask: (id, updatedTask) => set((state) => ({
        tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updatedTask } : task
        ),
    })),

    deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
    })),

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),
}))
