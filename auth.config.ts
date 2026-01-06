import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const userRole = auth?.user?.role;
            const isOnDashboard = nextUrl.pathname.startsWith('/tasks') || nextUrl.pathname === '/dashboard';
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            if (isOnAdmin) {
                if (isLoggedIn && userRole === 'ADMIN') return true;
                return Response.redirect(new URL('/tasks', nextUrl));
            }

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn && (nextUrl.pathname === '/' || nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register'))) {
                return Response.redirect(new URL('/tasks', nextUrl));
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
