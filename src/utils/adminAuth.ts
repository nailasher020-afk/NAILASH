import { AdminUser, AdminSession } from '../types';

const ADMIN_SESSION_KEY = 'nailash_admin_session';

/**
 * Sole authorized store owner and administrator email
 * Only this email address is permitted to manage the dashboard, products, and inventory.
 */
export const AUTHORIZED_OWNER_EMAIL = 'nailasher020@gmail.com';

/**
 * Returns true only if the given email matches the store owner email (nailasher020@gmail.com).
 */
export function isAuthorizedOwnerEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === AUTHORIZED_OWNER_EMAIL.toLowerCase();
}

const AUTHORIZED_ADMINS: Array<{
  username: string;
  email: string;
  acceptedPasswords: string[];
  user: AdminUser;
}> = [
  {
    username: 'nailasher020',
    email: 'nailasher020@gmail.com',
    acceptedPasswords: ['nailash123', 'admin123', 'Nailash@2026', 'nailasher020'],
    user: {
      id: 'adm-nailasher',
      name: 'Naila Sher',
      email: 'nailasher020@gmail.com',
      role: 'super_admin',
      avatar: 'NS'
    }
  },
  {
    username: 'nailasher',
    email: 'nailasher020@gmail.com',
    acceptedPasswords: ['nailash123', 'admin123', 'Nailash@2026', 'nailasher020'],
    user: {
      id: 'adm-nailasher',
      name: 'Naila Sher',
      email: 'nailasher020@gmail.com',
      role: 'super_admin',
      avatar: 'NS'
    }
  },
  {
    username: 'admin',
    email: 'nailasher020@gmail.com',
    acceptedPasswords: ['nailash123', 'admin123', 'Nailash@2026', 'nailasher020'],
    user: {
      id: 'adm-nailasher',
      name: 'Naila Sher',
      email: 'nailasher020@gmail.com',
      role: 'super_admin',
      avatar: 'NS'
    }
  }
];

/**
 * Retrieves the currently active admin session from sessionStorage/localStorage.
 * Returns null if not authenticated, expired, or if the email is not nailasher020@gmail.com.
 */
export function getAdminSession(): AdminSession | null {
  try {
    let raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) {
      raw = localStorage.getItem(ADMIN_SESSION_KEY);
    }

    if (!raw) return null;

    const session: AdminSession = JSON.parse(raw);
    
    if (!session || !session.token || !session.user || !session.expiresAt) {
      clearAdminSession();
      return null;
    }

    // Verify ownership: ONLY nailasher020@gmail.com is authorized
    if (session.user.email.toLowerCase() !== AUTHORIZED_OWNER_EMAIL.toLowerCase()) {
      clearAdminSession();
      return null;
    }

    // Verify expiration
    if (Date.now() > session.expiresAt) {
      clearAdminSession();
      return null;
    }

    return session;
  } catch (err) {
    console.error('Failed to parse admin session:', err);
    clearAdminSession();
    return null;
  }
}

/**
 * Validates admin credentials strictly against nailasher020@gmail.com.
 * No other email or visitor can log in or access the admin management portal.
 */
export function validateAdminCredentials(
  identifier: string,
  passwordAttempt: string
): { success: boolean; user?: AdminUser; error?: string } {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = passwordAttempt.trim();

  if (!cleanId) {
    return { success: false, error: 'Please enter your administrator email (nailasher020@gmail.com).' };
  }

  if (!cleanPass) {
    return { success: false, error: 'Please enter your administrator password.' };
  }

  const match = AUTHORIZED_ADMINS.find(
    (a) => a.username.toLowerCase() === cleanId || a.email.toLowerCase() === cleanId
  );

  // Strict check: ONLY nailasher020@gmail.com
  if (!match || match.email.toLowerCase() !== AUTHORIZED_OWNER_EMAIL.toLowerCase()) {
    return {
      success: false,
      error: `Access Denied: Yeh dashboard sirf store manager (nailasher020@gmail.com) ke liye makhsoos hai. Kisi aur user ko access ki ijazat nahi hai.`
    };
  }

  const isPasswordValid = match.acceptedPasswords.includes(cleanPass);
  if (!isPasswordValid) {
    return {
      success: false,
      error: 'Galat password! nailasher020@gmail.com ka durust password darj karein (e.g. nailash123 ya admin123).'
    };
  }

  return {
    success: true,
    user: {
      ...match.user,
      lastLogin: new Date().toISOString()
    }
  };
}

/**
 * Saves authenticated admin session with token and expiration.
 */
export function saveAdminSession(user: AdminUser, rememberMe: boolean = false): AdminSession {
  const durationMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;
  const session: AdminSession = {
    token: `nl_adm_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
    user,
    expiresAt: Date.now() + durationMs
  };

  try {
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    if (rememberMe) {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    }
  } catch (err) {
    console.error('Failed to store admin session:', err);
  }

  return session;
}

/**
 * Clears active administrator session from all browser storage.
 */
export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch (err) {
    console.error('Failed to remove admin session:', err);
  }
}

/**
 * Returns true if an active, valid administrator session exists for nailasher020@gmail.com.
 */
export function isCurrentSessionAdmin(): boolean {
  return getAdminSession() !== null;
}
