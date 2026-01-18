const API_BASE_URL = "http://localhost:8000/api/v1";

export interface FileMetadataResponse {
    file_id: string;
    filename: string;
    metadata_raw: Record<string, any>;
    metadata_preview_clean: Record<string, any>;
}

export const api = {
    stageFile: async (file: File): Promise<FileMetadataResponse> => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${API_BASE_URL}/files/stage`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        return res.json();
    },

    confirmUpload: async (file_id: string, expiry_hours: number) => {
        const res = await fetch(`${API_BASE_URL}/files/${file_id}/confirm?expiry_hours=${expiry_hours}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Confirmation failed");
        return res.json();
    },

    getFileInfo: async (file_id: string) => {
        const res = await fetch(`${API_BASE_URL}/files/${file_id}`);
        if (!res.ok) throw new Error("File not found or expired");
        return res.json();
    }
};
