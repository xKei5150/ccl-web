"use server";

import { payload } from "@/lib/payload";
import { cookies, headers as listHeaders } from "next/headers";

export async function getUser() {
    const headers = await listHeaders();
  const cookieStore = await cookies();

  const token = cookieStore.get("payload-token");
  if (!token) return null;

  try {
    const { user, permissions } = await payload.auth({ headers});
    
    return { ...user, permissions };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export async function login(formData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");
    const cookieStore = await cookies();
    const headers = await listHeaders();


    // Login with payload including the response object
    const result = await payload.login({
      collection: "users",
      data: { email, password },
      res: headers,
    });
    console.log('result:', result);
    if (!result.token) {
      throw new Error('No token received');
    }


    const token = result.token;

    // Set the cookie properly
    cookieStore.set('payload-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    // Get user permissions
    const { permissions } = await payload.auth({ headers });

    if (!result.user.isActive || result.user.isActive === 'inactive') {
      throw new Error('Account is inactive. Please contact support.');
    }

    return {
      success: true,
      user: { ...result.user, permissions },
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message || "An error occurred during login",
    };
  }
}


export async function forgotPassword(formData) {
  try {
    const email = formData.get("email");
    const token = await payload.forgotPassword({
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
    const result = await payload.resetPassword({
      collection: "users",
      data: { token, password },
      res: {
        setHeader: (name, value) => {
          cookies().set(name, value);
        },
      },
    });
    return { success: true, user: result.user };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to reset password",
    };
  }
}