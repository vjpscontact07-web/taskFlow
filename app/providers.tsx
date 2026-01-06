'use client'

import { HeroUIProvider } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
            <HeroUIProvider navigate={router.push}>
                {children}
            </HeroUIProvider>
        </SessionProvider>
    )
}
