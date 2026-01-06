'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { loginUser } from '@/actions/auth'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { Button, Input, Card, CardBody, CardHeader } from '@heroui/react'

export default function LoginForm() {
    const router = useRouter()
    const { update } = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: yupResolver(loginSchema),
    })

    const onSubmit = async (data: LoginInput) => {
        setIsLoading(true)

        try {
            const result = await loginUser(data.email, data.password)

            if (result.success) {
                toast.success('Logged in successfully!')
                // Update session immediately
                await update()
                router.push('/tasks')
                router.refresh()
            } else {
                toast.error(result.error || 'Login failed')
            }
        } catch (error) {
            toast.error('An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="glass border-none shadow-2xl">
            <CardHeader className="flex flex-col gap-1 pt-10 pb-4 px-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                <p className="text-foreground/50 font-medium">Sign in to your account</p>
            </CardHeader>
            <CardBody className="px-8 pb-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        {...register('email')}
                        label="Email"
                        placeholder="you@example.com"
                        labelPlacement="outside"
                        variant="bordered"
                        className="font-medium"
                        isInvalid={!!errors.email}
                        errorMessage={errors.email?.message}
                    />

                    <Input
                        {...register('password')}
                        label="Password"
                        placeholder="••••••••"
                        labelPlacement="outside"
                        type={showPassword ? 'text' : 'password'}
                        variant="bordered"
                        className="font-medium"
                        isInvalid={!!errors.password}
                        errorMessage={errors.password?.message}
                        endContent={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="text-foreground/30 w-5 h-5" />
                                ) : (
                                    <Eye className="text-foreground/30 w-5 h-5" />
                                )}
                            </button>
                        }
                    />

                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="w-full btn-primary text-white font-bold h-12 shadow-lg"
                    >
                        Sign In
                    </Button>

                    <div className="text-center pt-2">
                        <p className="text-sm text-foreground/50 font-medium">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-primary font-bold hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </form>
            </CardBody>
        </Card>
    )
}
