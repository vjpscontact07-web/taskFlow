'use client'

import { Button, Card, CardBody } from '@heroui/react'
import Link from 'next/link'
import { ArrowRight, Box, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16">
        <header className="flex justify-between items-center mb-24 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg">
              <Box className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">TaskFlow</span>
          </div>
          <div className="flex gap-4">
            <Button as={Link} href="/login" variant="light" className="font-medium">
              Sign In
            </Button>
            <Button as={Link} href="/register" className="btn-primary text-white font-semibold shadow-xl">
              Get Started
            </Button>
          </div>
        </header>

        <main>
          <div className="text-center max-w-3xl mx-auto mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-8">
              Manage Tasks with <span className="text-gradient">Elegance</span>
            </h1>
            <p className="text-xl text-foreground/70 mb-12 leading-relaxed">
              Experience the next generation of task management. Built with Next.js 15,
              designed for speed, and crafted for visual perfection.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                as={Link}
                href="/register"
                size="lg"
                className="btn-primary text-white text-lg h-14 px-8 shadow-2xl"
                endContent={<ArrowRight className="w-5 h-5" />}
              >
                Create Free Account
              </Button>
              <Button
                as={Link}
                href="/login"
                variant="bordered"
                size="lg"
                className="h-14 px-8 border-2 font-semibold"
              >
                Explore Demo
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-primary" />}
              title="Secure Auth"
              description="NextAuth v5 with role-based access control keeps your data safe and private."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-accent" />}
              title="Lightning Fast"
              description="Built on Next.js 15 for peak performance and instantaneous interactions."
            />
            <FeatureCard
              icon={<Box className="w-8 h-8 text-primary" />}
              title="Cloud Native"
              description="Seamlessly upload and manage task attachments with Cloudinary integration."
            />
          </div>
        </main>

        <footer className="text-center py-8 border-t border-border mt-20">
          <p className="text-foreground/50 text-sm">
            © {new Date().getFullYear()} TaskFlow. All rights reserved. Built with passion.
          </p>
        </footer>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="glass border-none hover:translate-y-[-8px] transition-all duration-300">
      <CardBody className="p-8">
        <div className="w-14 h-14 rounded-2xl bg-white/50 dark:bg-black/20 flex items-center justify-center mb-6 shadow-sm">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="text-foreground/60 leading-relaxed font-medium">
          {description}
        </p>
      </CardBody>
    </Card>
  )
}
