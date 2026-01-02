

'use server'

import { prisma } from '@/lib/prisma'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { hash } from 'bcryptjs'
import { signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'


export async function registerUser(data: RegisterInput) {
    try {
        // Validate input
        const validatedFields = registerSchema.safeParse(data)

        if (!validatedFields.success) {
            return {
                success: false,
                error: 'Invalid input data',
            }
        }

        const { name, email, password } = validatedFields.data

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return {
                success: false,
                error: 'User with this email already exists',
            }
        }

        // Hash password with bcryptjs (10 rounds)
        const hashedPassword = await hash(password, 10)

        // Create user in database
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        return {
            success: true,
            message: 'User registered successfully',
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        }
    } catch (error) {
        console.error('Registration error:', error)
        return {
            success: false,
            error: 'An error occurred during registration',
        }
    }
}

/**
 * Login user with credentials
 */
export async function loginUser(email: string, password: string) {
    try {
        await signIn('credentials', {
            email,
            password,
            redirect: false,
        })

        return {
            success: true,
            message: 'Logged in successfully',
        }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {
                        success: false,
                        error: 'Invalid email or password',
                    }
                default:
                    return {
                        success: false,
                        error: 'An error occurred during login',
                    }
            }
        }
        throw error
    }
}
