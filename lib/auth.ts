import { cookies } from 'next/headers';

export async function isAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    return adminSession?.value === 'authenticated';
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

export async function getUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('admin_user_id');
    return userId?.value || null;
  } catch (error) {
    console.error('Get user ID error:', error);
    return null;
  }
}

