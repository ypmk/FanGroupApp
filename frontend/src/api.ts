import { getAdminToken } from "./auth";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";


async function rawRequest(path: string, options: RequestInit = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers as Record<string, string> | undefined),
        },
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`${res.status} ${res.statusText} ${text}`);
    }

    return res.json();
}


export async function login(username: string, password: string): Promise<string> {
    const data = await rawRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
    });
    return data.token;
}


async function adminRequest(path: string, options: RequestInit = {}) {
    const token = getAdminToken();

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers as Record<string, string> | undefined),
        },
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`${res.status} ${res.statusText} ${text}`);
    }

    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("application/json")) return null;

    return res.json();
}


export async function createMerch(item: {
    title: string;
    description: string;
    price: number;
    imageUrl: string;
}) {
    return adminRequest("/api/admin/merch", {
        method: "POST",
        body: JSON.stringify(item),
    });
}