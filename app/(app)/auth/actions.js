"use server";

import { payload } from "@/lib/payload";
import { cookies, headers as listHeaders } from "next/headers";

export async function getUser() {
    const headers = await listHeaders();
    const cookieStore = await cookies();

    const token = cookieStore.get("payload-token");
    if (!token) return null;
    const tokenValue = token.value;
    if (!tokenValue) return null;
    
    try {
        // Check if token is expired
        const tokenData = JSON.parse(atob(tokenValue.split('.')[1]));
        if (tokenData.exp * 1000 < Date.now()) {
            // Token is expired, clear cookies
            cookieStore.delete('payload-token');
            cookieStore.delete('user-role');
            return null;
        }

        const { user, permissions } = await payload.auth({ headers });
        
        // Ensure user-role cookie is set during session checks
        if (user && user.role && !cookieStore.get('user-role')) {
            cookieStore.set('user-role', user.role, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });
        }
        
        return { ...user, permissions };
    } catch (error) {
        console.error('Auth error:', error);
        // Clear cookies on auth error
        cookieStore.delete('payload-token');
        cookieStore.delete('user-role');
        return null;
    }
}

export async function login(formData) {
    try {
        const email = formData.get("email");
        const password = formData.get("password");
        
        if (!email) {
            return {
                success: false,
                error: "Email is required",
            };
        }

        if (!password) {
            return {
                success: false,
                error: "Password is required",
            };
        }

        const cookieStore = await cookies();
        const headers = await listHeaders();

        const result = await payload.login({
            collection: "users",
            data: { email, password },
            res: headers,
        });

        if (!result.token || !result.exp) {
            return {
                success: false,
                error: "Invalid login response",
            };
        }

        if (!result.user.isActive || result.user.isActive === 'inactive') {
            return {
                success: false,
                error: "Account is inactive. Please contact support.",
            };
        }

        // Calculate maxAge based on token expiration
        const now = Math.floor(Date.now() / 1000);
        const maxAge = result.exp - now;

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: maxAge, // Use dynamic expiration from token
        };

        // Set cookies using the server-side cookies() API
        cookieStore.set('payload-token', result.token, cookieOptions);
        cookieStore.set('user-role', result.user.role, cookieOptions);

        // Get user permissions
        const { permissions } = await payload.auth({ headers });

        return {
            success: true,
            user: { ...result.user, permissions },
            exp: result.exp,
        };

    } catch (error) {
        console.error('Login error:', error);
        const cookieStore = await cookies();
        // Clear cookies on login error
        cookieStore.delete('payload-token');
        cookieStore.delete('user-role');

        // Return more specific error messages
        if (error.message.toLowerCase().includes('credentials')) {
            return {
                success: false,
                error: "Invalid email or password",
            };
        }

        return {
            success: false,
            error: error.message || "An error occurred during login",
        };
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('payload-token');
    cookieStore.delete('user-role');
    return { success: true };
}

export async function forgotPassword(formData) {
    try {
        const email = formData.get("email");
        await payload.forgotPassword({
            collection: "users",
            data: { email },
        });
        return { success: true, message: "Recovery email sent" };
    } catch (error) {
        return {
            success: false,
            error: error.message || "Failed to process forgot password request",
        };
    }
}

export async function resetPassword({ token, password }) {
    try {
        const cookieStore = await cookies();
        const result = await payload.resetPassword({
            collection: "users",
            data: { token, password },
        });

        if (result.token) {
            cookieStore.set('payload-token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });
        }

        return { success: true, user: result.user };
    } catch (error) {
        return {
            success: false,
            error: error.message || "Failed to reset password",
        };
    }
}

export async function register(formData) {
    try {
        // Create personal information record first
        const personalInfoData = {
            name: formData.name,
            contact: {
                emailAddress: formData.email,
                localAddress: formData.contact.localAddress
            },
            demographics: formData.demographics,
            status: formData.status
        };

        const personalInfo = await payload.create({
            collection: 'personal-information',
            data: personalInfoData
        });

        // Create user account and link to personal information
        const userData = {
            email: formData.email,
            password: formData.password,
            role: 'citizen',
            personalInfo: personalInfo.id,
            isActive: 'active'
        };

        const result = await payload.create({
            collection: 'users',
            data: userData
        });

        return { success: true, user: result };
    } catch (error) {
        console.error('Registration error:', error);
        // Clean up personal info if user creation fails
        // You might want to add error handling here
        return {
            success: false,
            error: error.message || "Registration failed"
        };
    }
}