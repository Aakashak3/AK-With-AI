import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uonhtwihplrrkczjtbmj.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbmh0d2locGxycmtjemp0Ym1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjkwNzQsImV4cCI6MjA4NjIwNTA3NH0.JuBuKJYAl9zjvUsvOlLgUksgXojWkkIGCqHjDzTdyTk',
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const isAdminPath = request.nextUrl.pathname.startsWith('/admin/dashboard');

    if (isAdminPath) {
        if (!user) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }

        const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'aakashnarayanan465@gmail.com')
            .split(',')
            .map((email) => email.trim().toLowerCase());

        if (!adminEmails.includes(user.email?.toLowerCase() || '')) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: ['/admin/dashboard/:path*'],
};
