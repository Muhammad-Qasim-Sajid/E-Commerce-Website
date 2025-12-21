import { getCsrfToken } from "../utils";

export async function adminLogin(data: { email: string; password: string }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
    }

    return response.json();
}

export async function adminLogout() {
    const csrfToken = getCsrfToken();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/logout`, {
        method: "POST",
        headers: {
            ...(csrfToken && { 'x-csrf-token': csrfToken })
        },
        credentials: 'include',
    });

    if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Logout failed');
    }

    return response.json();
}

export async function isAdmin() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/is-admin`, {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Unauthorized');
    }

    return response.json();
}