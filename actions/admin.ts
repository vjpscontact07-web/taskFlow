'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { Role } from "@prisma/client"

async function checkAdmin() {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
        throw new Error("Unauthorized: Admin access required")
    }
    return session
}

export async function getAdminStats() {
    try {
        await checkAdmin()

        const [totalUsers, totalTasks, tasksByStatus] = await Promise.all([
            prisma.user.count(),
            prisma.task.count(),
            prisma.task.groupBy({
                by: ['status'],
                _count: true,
            })
        ])

        const recentTasks = await prisma.task.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            }
        })

        return {
            success: true,
            data: {
                totalUsers,
                totalTasks,
                tasksByStatus: Object.fromEntries(tasksByStatus.map(item => [item.status, item._count])),
                recentTasks: recentTasks.map(t => ({
                    ...t,
                    owner: t.user.name || t.user.email
                }))
            }
        }
    } catch (error: any) {
        console.error("getAdminStats error:", error)
        return { success: false, error: error.message }
    }
}

export async function getAllUsers() {
    try {
        await checkAdmin()

        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { tasks: true }
                }
            }
        })

        return {
            success: true,
            data: users.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                image: u.image,
                taskCount: u._count.tasks,
                createdAt: u.createdAt
            }))
        }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function updateUserRole(userId: string, newRole: Role) {
    try {
        await checkAdmin()

        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole }
        })

        revalidatePath('/admin/users')
        return { success: true, message: `User role updated to ${newRole}` }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteUser(userId: string) {
    try {
        await checkAdmin()

        // Admin cannot delete themselves
        const session = await auth()
        if (session?.user?.id === userId) {
            return { success: false, error: "You cannot delete your own admin account" }
        }

        await prisma.user.delete({
            where: { id: userId }
        })

        revalidatePath('/admin/users')
        return { success: true, message: "User deleted successfully" }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
