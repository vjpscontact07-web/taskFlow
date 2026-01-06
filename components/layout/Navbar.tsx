'use client'

import {
    Navbar as HeroNavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Avatar,
    Badge
} from '@heroui/react'
import { Box, LayoutDashboard, Users, LogOut, CheckSquare } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const { data: session } = useSession()
    const pathname = usePathname()
    const user = session?.user
    const isAdmin = user?.role === 'ADMIN'

    const handleLogout = () => {
        signOut({ callbackUrl: '/' })
    }

    return (
        <HeroNavbar
            maxWidth="xl"
            className="glass fixed top-0 w-full z-50 transition-all duration-300 data-[menu-open=true]:border-none"
        >
            <NavbarBrand>
                <Link href="/tasks" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-105">
                        <Box className="text-white w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        TaskFlow
                    </span>
                </Link>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-6" justify="center">
                <NavbarItem isActive={pathname === '/tasks'}>
                    <Link
                        href="/tasks"
                        className={`font-medium flex items-center gap-2 transition-colors ${pathname === '/tasks' ? "text-primary font-semibold" : "text-foreground/70 hover:text-foreground"}`}
                    >
                        <CheckSquare size={18} className={pathname === '/tasks' ? "fill-primary/10" : ""} />
                        My Tasks
                    </Link>
                </NavbarItem>

                {isAdmin && (
                    <NavbarItem isActive={pathname.startsWith('/admin')}>
                        <Link
                            href="/admin"
                            className={`font-medium flex items-center gap-2 transition-colors ${pathname.startsWith('/admin') ? "text-primary font-semibold" : "text-foreground/70 hover:text-foreground"}`}
                        >
                            <LayoutDashboard size={18} className={pathname.startsWith('/admin') ? "fill-primary/10" : ""} />
                            Admin
                        </Link>
                    </NavbarItem>
                )}
            </NavbarContent>

            <NavbarContent justify="end">
                {user && (
                    <NavbarItem className="mr-2">
                        <Button
                            isIconOnly
                            variant="flat"
                            color="danger"
                            className="bg-danger/10 text-danger hover:bg-danger/20"
                            onPress={handleLogout}
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </Button>
                    </NavbarItem>
                )}
                {user ? (
                    <Dropdown
                        placement="bottom-end"
                        backdrop="blur"
                        classNames={{
                            content: "bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl min-w-[240px] p-2",
                        }}
                    >
                        <DropdownTrigger>
                            <div className="flex items-center gap-3 cursor-pointer group">
                                <div className="flex flex-col items-end hidden md:flex transition-opacity group-hover:opacity-80">
                                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-primary/80">{user.role}</p>
                                </div>
                                <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform group-hover:scale-105 ring-2 ring-transparent group-hover:ring-primary/20"
                                    color={user.role === 'ADMIN' ? "secondary" : "primary"}
                                    name={user.name || "User"}
                                    size="sm"
                                    src={user.image || ""}
                                />
                            </div>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Profile Actions"
                            variant="flat"
                            className="p-1"
                            itemClasses={{
                                base: [
                                    "rounded-xl",
                                    "text-foreground/80",
                                    "transition-opacity",
                                    "data-[hover=true]:text-foreground",
                                    "data-[hover=true]:bg-foreground/5",
                                    "dark:data-[hover=true]:bg-white/10",
                                ],
                            }}
                        >
                            <DropdownItem key="profile" className="h-14 gap-2 opacity-100 pointer-events-none mb-2">
                                <p className="font-semibold text-foreground/50 text-xs uppercase tracking-wide">Signed in as</p>
                                <p className="font-bold text-foreground text-md">{user.email}</p>
                            </DropdownItem>

                            <DropdownItem key="divider-1" className="h-px bg-default-100 my-1 p-0 opacity-50" textValue="divider" />

                            {isAdmin ? (
                                <DropdownItem
                                    key="admin-management"
                                    startContent={<Users size={18} className="text-secondary" />}
                                    description="Manage system users"
                                    as={Link}
                                    href="/admin/users"
                                    className="data-[hover=true]:bg-secondary/10 data-[hover=true]:text-secondary group"
                                >
                                    Manage Users
                                </DropdownItem>
                            ) : null}

                            <DropdownItem
                                key="logout"
                                className="text-danger data-[hover=true]:bg-danger/10 data-[hover=true]:text-danger mt-1 group"
                                startContent={<LogOut size={18} />}
                                onPress={handleLogout}
                            >
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : (
                    <NavbarItem>
                        <Button
                            as={Link}
                            href="/login"
                            className="bg-primary text-white shadow-lg shadow-primary/30 font-semibold"
                            radius="full"
                            size="sm"
                        >
                            Login
                        </Button>
                    </NavbarItem>
                )}
            </NavbarContent>
        </HeroNavbar>
    )
}
