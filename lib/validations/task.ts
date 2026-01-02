

import { z } from 'zod'

export const taskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: z.string().optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).default('TODO'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
    dueDate: z.preprocess(
        (val) => (val === '' ? undefined : val),
        z.union([z.date(), z.string()]).optional().nullable()
    ).transform((val) => (val ? new Date(val) : val)),
    attachment: z.string().url().optional().nullable(),
})

export type TaskInput = z.output<typeof taskSchema>
export type TaskFormInput = z.input<typeof taskSchema>
