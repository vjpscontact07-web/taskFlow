'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { registerUser } from '@/actions/auth'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { Button, Input, Card, CardBody, CardHeader } from '@heroui/react'

export default function RegisterForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: yupResolver(registerSchema),
    })

    const onSubmit = async (data: RegisterInput) => {
        setIsLoading(true)

        try {
            const result = await registerUser(data)

            if (result.success) {
                toast.success('Account created successfully! Please sign in.')
                router.push('/login')
            } else {
                toast.error(result.error || 'Registration failed')
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
                <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
                <p className="text-foreground/50 font-medium">Get started with TaskFlow</p>
            </CardHeader>
            <CardBody className="px-8 pb-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        {...register('name')}
                        label="Full Name"
                        placeholder="John Doe"
                        labelPlacement="outside"
                        variant="bordered"
                        className="font-medium"
                        isInvalid={!!errors.name}
                        errorMessage={errors.name?.message}
                    />

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

                    <div className="space-y-1">
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
                        <p className="text-[10px] text-foreground/40 font-medium px-1">
                            8+ characters with uppercase, lowercase, and number
                        </p>
                    </div>

                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="w-full btn-primary text-white font-bold h-12 shadow-lg"
                    >
                        Create Account
                    </Button>

                    <div className="text-center pt-2">
                        <p className="text-sm text-foreground/50 font-medium">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary font-bold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </CardBody>
        </Card>
    )
}
