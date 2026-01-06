import * as yup from 'yup'

export const taskSchema = yup.object({
    title: yup.string().min(1, 'Title is required').max(200, 'Title too long').required('Title is required'),
    description: yup.string().nullable(),
    status: yup.string().oneOf(['TODO', 'IN_PROGRESS', 'COMPLETED'] as const).default('TODO').defined(),
    priority: yup.string().oneOf(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const).default('MEDIUM').defined(),
    dueDate: yup.date().transform((val, originalValue) => {
        if (originalValue === '' || originalValue === null || originalValue === undefined) return null;
        return val;
    }).nullable(),
    attachment: yup.string()
        .transform((val, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) return null;
            return val;
        })
        .url('Must be a valid URL')
        .nullable(),
}).required();

export type TaskInput = {
    title: string;
    description: string | null;
    status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    dueDate: Date | null;
    attachment: string | null;
};
// TaskFormInput allows string for the datetime-local input
export type TaskFormInput = Omit<TaskInput, 'dueDate'> & {
    dueDate: string | Date | null;
};

export const partialTaskSchema = yup.object({
    title: yup.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
    description: yup.string().optional().nullable(),
    status: yup.string().oneOf(['TODO', 'IN_PROGRESS', 'COMPLETED'] as const).optional(),
    priority: yup.string().oneOf(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const).optional(),
    dueDate: yup.date().transform((val, originalValue) => {
        if (originalValue === '') return undefined;
        return val;
    }).optional().nullable(),
    attachment: yup.string()
        .transform((val, originalValue) => {
            if (originalValue === '' || originalValue === null || originalValue === undefined) return null;
            return val;
        })
        .url('Must be a valid URL')
        .optional()
        .nullable(),
});
