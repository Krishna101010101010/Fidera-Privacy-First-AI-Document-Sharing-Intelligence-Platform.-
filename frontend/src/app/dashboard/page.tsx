'use client';

import { useEffect, useState } from 'react';
import { api, auth, type FileRead } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
    const router = useRouter();
    const [files, setFiles] = useState<FileRead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const data = await api.getDashboard();
                setFiles(data);
            } catch (err: any) {
                setError(err.message);
                // If not authenticated, redirect to login
                if (err.message.includes('authenticated')) {
                    router.push('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [router]);

    const handleLogout = () => {
        api.logout();
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="text-neutral-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">
                            Dashboard
                        </h1>
                        <p className="text-neutral-500 mt-2">Manage your secure files</p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href="/"
                            className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition"
                        >
                            Upload New
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Files List */}
                {files.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📄</div>
                        <h2 className="text-2xl font-bold text-neutral-400 mb-2">No files yet</h2>
                        <p className="text-neutral-600 mb-6">Upload your first document to get started</p>
                        <Link
                            href="/"
                            className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition"
                        >
                            Upload Document
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {files.map((file) => (
                            <div
                                key={file.id}
                                className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white mb-2">
                                            {file.filename}
                                        </h3>
                                        <div className="flex gap-4 text-sm text-neutral-500">
                                            <span>Size: {(file.file_size / 1024).toFixed(2)} KB</span>
                                            <span>•</span>
                                            <span>Created: {new Date(file.created_at).toLocaleDateString()}</span>
                                            {file.expires_at && (
                                                <>
                                                    <span>•</span>
                                                    <span className={new Date(file.expires_at) < new Date() ? 'text-red-400' : 'text-green-400'}>
                                                        Expires: {new Date(file.expires_at).toLocaleDateString()}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* Status Badges */}
                                        <div className="flex gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${file.status === 'stored' ? 'bg-green-900/30 text-green-400' :
                                                    file.status === 'staging' ? 'bg-yellow-900/30 text-yellow-400' :
                                                        'bg-red-900/30 text-red-400'
                                                }`}>
                                                {file.status.toUpperCase()}
                                            </span>

                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${file.ai_status === 'completed' ? 'bg-indigo-900/30 text-indigo-400' :
                                                    file.ai_status === 'processing' ? 'bg-orange-900/30 text-orange-400' :
                                                        'bg-neutral-800 text-neutral-500'
                                                }`}>
                                                AI: {file.ai_status.toUpperCase()}
                                            </span>
                                        </div>

                                        {/* View Button */}
                                        {file.status === 'stored' && (
                                            <Link
                                                href={`/view/${file.id}`}
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition"
                                            >
                                                View & Chat
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
