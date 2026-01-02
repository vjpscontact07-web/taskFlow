

import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Create admin user
    const adminPassword = await hash('Admin123!', 10)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@taskflow.com' },
        update: {},
        create: {
            email: 'admin@taskflow.com',
            name: 'Admin User',
            password: adminPassword,
            role: 'ADMIN',
        },
    })
    console.log('✅ Created admin user:', admin.email)

    // Create regular user
    const userPassword = await hash('User123!', 10)
    const user = await prisma.user.upsert({
        where: { email: 'user@taskflow.com' },
        update: {},
        create: {
            email: 'user@taskflow.com',
            name: 'Test User',
            password: userPassword,
            role: 'USER',
        },
    })
    console.log('✅ Created test user:', user.email)

    // Create sample tasks for the user
    const tasks = await Promise.all([
        prisma.task.create({
            data: {
                title: 'Complete project documentation',
                description: 'Write comprehensive README and API documentation',
                status: 'IN_PROGRESS',
                priority: 'HIGH',
                userId: user.id,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            },
        }),
        prisma.task.create({
            data: {
                title: 'Review pull requests',
                description: 'Review and merge pending pull requests',
                status: 'TODO',
                priority: 'MEDIUM',
                userId: user.id,
            },
        }),
        prisma.task.create({
            data: {
                title: 'Deploy to production',
                description: 'Deploy the latest version to production environment',
                status: 'TODO',
                priority: 'URGENT',
                userId: user.id,
                dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            },
        }),
        prisma.task.create({
            data: {
                title: 'Update dependencies',
                description: 'Update all npm packages to latest versions',
                status: 'COMPLETED',
                priority: 'LOW',
                userId: user.id,
            },
        }),
    ])

    console.log(`✅ Created ${tasks.length} sample tasks`)

    console.log('🎉 Database seeding completed!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
