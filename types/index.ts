

import { User, Task, Role, TaskStatus, Priority } from '@prisma/client'


export type { User, Task, Role, TaskStatus, Priority }


export type SafeUser = Omit<User, 'password'>


export type TaskWithUser = Task & {
    user: SafeUser
}


export type ApiResponse<T = any> = {
    success: boolean
    data?: T
    error?: string
    message?: string
}
