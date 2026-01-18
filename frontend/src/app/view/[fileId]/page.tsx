'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

export default function ViewerPage() {
    const { fileId } = useParams();
    const [fileInfo, setFileInfo] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (fileId) {
            api.getFileInfo(fileId as string)
                .then(setFileInfo)
                .catch(err => setError(err.message));
        }
    }, [fileId]);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-red-500 font-mono text-xl">
                ⚠️ 404: {error}
            </div>
        );
    }

    if (!fileInfo) {
        return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-500">Loading Secure Document...</div>;
    }

    const pdfUrl = `http://localhost:8000/api/v1/files/${fileId}/content`;

    return (
        <div className="flex h-screen bg-neutral-900 text-white overflow-hidden">
            {/* LEFT: Document Viewer */}
            <div className="flex-1 relative bg-neutral-800 flex flex-col">
                {/* Header */}
                <div className="h-14 border-b border-neutral-700 flex items-center px-6 justify-between bg-neutral-900 z-10">
                    <div className="flex items-center gap-2">
                        <h1 className="font-bold text-neutral-200 truncate max-w-md">{fileInfo.filename}</h1>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-900 text-green-300 border border-green-700">Sanitized</span>
                    </div>
                    <div className="text-xs text-neutral-500">View Only • No Download</div>
                </div>

                {/* PDF Frame */}
                <div className="flex-1 relative">
                    <iframe
                        src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                        className="w-full h-full border-none"
                        title="Document Viewer"
                    />

                    {/* Watermark Overlay */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none overflow-hidden">
                        <div className="transform -rotate-45 text-9xl font-black whitespace-nowrap text-white">
                            FIDERA SECURE • {fileId} • FIDERA SECURE
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: AI Chat Panel */}
            <div className="w-[400px] border-l border-neutral-700 bg-neutral-950 flex flex-col">
                <div className="h-14 border-b border-neutral-800 flex items-center px-4 bg-neutral-950">
                    <span className="text-sm font-semibold flex items-center gap-2">
                        ✨ Ask AI
                    </span>
                </div>

                <div className="flex-1 p-4 flex flex-col items-center justify-center text-center text-neutral-500">
                    <p className="mb-2">Currently Indexing...</p>
                    <p className="text-xs max-w-xs">Ask questions about this document (coming in next update).</p>
                </div>

                <div className="p-4 border-t border-neutral-800">
                    <input
                        disabled
                        placeholder="Ask a question..."
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-sm focus:outline-none cursor-not-allowed"
                    />
                </div>
            </div>
        </div>
    );
}
