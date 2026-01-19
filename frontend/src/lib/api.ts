const API_BASE_URL = "http://localhost:8000/api/v1";

export interface FileMetadataResponse {
    file_id: string;
    filename: string;
    metadata_raw: Record<string, any>;
    metadata_preview_clean: Record<string, any>;
}

export interface User {
    id: string;
    email: string;
    full_name?: string;
    is_active: boolean;
}

export interface FileRead {
    id: string;
    filename: string;
    content_type: string;
    file_size: number;
    status: string;
    created_at: string;
    expires_at?: string;
    ai_status: string;
}

// Token management
const TOKEN_KEY = "fidera_token";

export const auth = {
    setToken: (token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, token);
        }
    },

    getToken: (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(TOKEN_KEY);
        }
        return null;
    },

    clearToken: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_KEY);
        }
    },

    getHeaders: () => {
        const token = auth.getToken();
        return token ? { "Authorization": `Bearer ${token}` } : {};
    }
};

export const api = {
    // Auth
    login: async (email: string, password: string): Promise<{ access_token: string, token_type: string }> => {
        const formData = new FormData();
        formData.append("username", email); // OAuth2 spec uses 'username'
        formData.append("password", password);

        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error("Login failed");
        const data = await res.json();
        auth.setToken(data.access_token);
        return data;
    },

    register: async (email: string, password: string, full_name?: string): Promise<User> => {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, full_name }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Registration failed");
        }
        return res.json();
    },

    getMe: async (): Promise<User> => {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: auth.getHeaders(),
        });

        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
    },

    logout: () => {
        auth.clearToken();
    },

    // Files
    stageFile: async (file: File): Promise<FileMetadataResponse> => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${API_BASE_URL}/files/stage`, {
            method: "POST",
            headers: auth.getHeaders(), // Include token if available
            body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        return res.json();
    },

    confirmUpload: async (file_id: string, expiry_hours: number) => {
        const res = await fetch(`${API_BASE_URL}/files/${file_id}/confirm?expiry_hours=${expiry_hours}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...auth.getHeaders() },
        });

        if (!res.ok) throw new Error("Confirmation failed");
        return res.json();
    },

    getFileInfo: async (file_id: string) => {
        const res = await fetch(`${API_BASE_URL}/files/${file_id}`);
        if (!res.ok) throw new Error("File not found or expired");
        return res.json();
    },

    getDashboard: async (): Promise<FileRead[]> => {
        const res = await fetch(`${API_BASE_URL}/files/dashboard`, {
            headers: auth.getHeaders(),
        });

        if (!res.ok) throw new Error("Failed to fetch dashboard");
        return res.json();
    },

    // Chat
    getModels: async (): Promise<{ models: string[] }> => {
        const res = await fetch(`${API_BASE_URL}/chat/models`);
        return res.json();
    },

    chatStream: async (file_id: string, message: string, model: string) => {
        return fetch(`${API_BASE_URL}/chat/message`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file_id, message, model }),
        });
    }
};
