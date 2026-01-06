

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { taskSchema } from '@/lib/validations/task'

/**
 * GET /api/tasks
 * List all tasks (with authorization)
 */
export async function GET() {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Admin can see all tasks, users see only their own
        const tasks = await prisma.task.findMany({
            where: session.user.role === 'ADMIN'
                ? {}
                : { userId: session.user.id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json({
            success: true,
            data: tasks,
        })
    } catch (error) {
        console.error('GET /api/tasks error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/tasks
 * Create a new task
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()

        // Validate input
        let validatedData;
        try {
            validatedData = taskSchema.validateSync(body, { abortEarly: false });
        } catch (error: any) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid input data',
                    details: error.inner?.map((e: any) => ({
                        path: e.path,
                        message: e.message
                    })) || error.message,
                },
                { status: 400 }
            )
        }

        const task = await prisma.task.create({
            data: {
                ...validatedData,
                userId: session.user.id,
            },
        })

        return NextResponse.json({
            success: true,
            data: task,
            message: 'Task created successfully',
        }, { status: 201 })
    } catch (error) {
        console.error('POST /api/tasks error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
