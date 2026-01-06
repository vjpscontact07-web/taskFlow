

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { taskSchema, partialTaskSchema } from '@/lib/validations/task'

/**
 * GET /api/tasks/[id]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const task = await prisma.task.findUnique({
            where: { id },
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
        })

        if (!task) {
            return NextResponse.json(
                { success: false, error: 'Task not found' },
                { status: 404 }
            )
        }

        // Check authorization
        if (task.userId !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, error: 'Forbidden' },
                { status: 403 }
            )
        }

        return NextResponse.json({
            success: true,
            data: task,
        })
    } catch (error) {
        console.error('GET /api/tasks/[id] error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * PUT /api/tasks/[id]
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const existingTask = await prisma.task.findUnique({
            where: { id },
        })

        if (!existingTask) {
            return NextResponse.json(
                { success: false, error: 'Task not found' },
                { status: 404 }
            )
        }

        // Check authorization
        if (existingTask.userId !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, error: 'Forbidden' },
                { status: 403 }
            )
        }

        const body = await request.json()

        // Validate input (partial update allowed)
        let validatedData;
        try {
            validatedData = partialTaskSchema.validateSync(body, { abortEarly: false });
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

        const task = await prisma.task.update({
            where: { id },
            data: validatedData,
        })

        return NextResponse.json({
            success: true,
            data: task,
            message: 'Task updated successfully',
        })
    } catch (error) {
        console.error('PUT /api/tasks/[id] error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * DELETE /api/tasks/[id]
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const existingTask = await prisma.task.findUnique({
            where: { id },
        })

        if (!existingTask) {
            return NextResponse.json(
                { success: false, error: 'Task not found' },
                { status: 404 }
            )
        }

        // Check authorization
        if (existingTask.userId !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, error: 'Forbidden' },
                { status: 403 }
            )
        }

        await prisma.task.delete({
            where: { id },
        })

        return NextResponse.json({
            success: true,
            message: 'Task deleted successfully',
        })
    } catch (error) {
        console.error('DELETE /api/tasks/[id] error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
