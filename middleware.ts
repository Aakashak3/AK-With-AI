import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
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
