'use client';

import { useState } from 'react';
import { api, FileMetadataResponse } from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ClickSpark from '@/components/ClickSpark';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [stagedData, setStagedData] = useState<FileMetadataResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setLoading(true);
            try {
                const data = await api.stageFile(selectedFile);
                setStagedData(data);
            } catch (err) {
                alert("Error staging file via API (Is Backend running?)");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleConfirm = async () => {
        if (!stagedData) return;
        setLoading(true);
        try {
            await api.confirmUpload(stagedData.file_id, 24);
            setConfirmed(true);
        } catch (err) {
            alert("Error confirming file");
        } finally {
            setLoading(false);
        }
    };

    // Helper to categorize metadata for the UI
    const getCategorizedData = (data: any) => {
        const categories: Record<string, Record<string, any>> = {
            '🚨 High Risk': {},
            '👤 Identity & Origin': {},
            '⚙️ Technical Specs': {},
            '💾 System Info': {},
            'ℹ️ Other': {}
        };

        let riskScore = 0;

        Object.entries(data).forEach(([key, val]) => {
            const k = key.toLowerCase();
            if (k.includes('gps') || k.includes('latitude') || k.includes('device') || k.includes('creator') || k.includes('author') || k.includes('software')) {
                categories['🚨 High Risk'][key] = val;
                riskScore += 10;
            } else if (k.includes('date') || k.includes('time') || k.includes('producer')) {
                categories['👤 Identity & Origin'][key] = val;
                riskScore += 2;
            } else if (k.includes('profile') || k.includes('version') || k.includes('format') || k.includes('size') || k.includes('count') || k.includes('mime')) {
                categories['⚙️ Technical Specs'][key] = val;
            } else if (k.startsWith('file') || k.includes('directory')) {
                categories['💾 System Info'][key] = val;
            } else {
                categories['ℹ️ Other'][key] = val;
            }
        });

        // Clean up empty categories
        Object.keys(categories).forEach(k => {
            if (Object.keys(categories[k]).length === 0) delete categories[k];
        });

        return { categories, riskScore };
    };

    if (confirmed) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6 max-w-xl">
                    <div className="text-8xl mb-6">✅</div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">File Secured</h1>
                    <p className="text-neutral-400 text-lg leading-relaxed">
                        Your document has been sanitized, encrypted, and is ready for safe transmission.
                    </p>

                    <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-500">Sanitization</span>
                            <span className="text-green-400 font-medium">Complete ✓</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-500">Storage</span>
                            <span className="text-green-400 font-medium">Encrypted (AES-256) 🔒</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-500">AI Context</span>
                            <span className="text-indigo-400 font-medium">Processing 🤖</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-500">Expiration</span>
                            <span className="text-orange-400 font-medium">24 Hours ⏰</span>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center pt-6">
                        <Link href={`/view/${stagedData?.file_id}`} className="px-10 py-4 bg-indigo-600 rounded-2xl hover:bg-indigo-500 font-bold text-lg shadow-xl shadow-indigo-900/30 transition-all hover:-translate-y-1">
                            View & Chat with AI →
                        </Link>
                        <button onClick={() => window.location.reload()} className="px-10 py-4 bg-neutral-800 rounded-2xl hover:bg-neutral-700 font-medium transition-all">
                            Upload Another
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white p-6">
            <div className="max-w-7xl mx-auto">
                <Link href="/" className="inline-flex items-center text-neutral-500 hover:text-white mb-12 transition">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </Link>

                {/* Header */}
                {!stagedData && (
                    <div className="text-center mb-16">
                        <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-4">
                            Upload Document
                        </h1>
                        <p className="text-xl text-neutral-500 max-w-2xl mx-auto">
                            See the <span className="text-indigo-400">Transparency Gate</span> in action
                        </p>
                    </div>
                )}

                {/* Upload State */}
                {!stagedData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl mx-auto relative"
                    >
                        <div className="border-2 border-dashed border-neutral-800 rounded-3xl p-20 text-center hover:border-indigo-500/50 hover:bg-neutral-900/30 transition-all cursor-pointer group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition duration-500" />

                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.docx,.jpg,.jpeg,.png,.mp3,.mp4"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />

                            <div className="relative z-0 space-y-6">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-24 h-24 bg-neutral-800 rounded-3xl mx-auto flex items-center justify-center group-hover:scale-110 transition duration-300 shadow-2xl"
                                >
                                    <svg className="w-12 h-12 text-neutral-400 group-hover:text-indigo-400 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </motion.div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition">Drop your Document here</h3>
                                    <p className="text-neutral-500 mt-2">or click to browse</p>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center text-xs text-neutral-600">
                                    {['PDF', 'DOCX', 'JPG', 'PNG', 'MP3', 'MP4'].map(format => (
                                        <span key={format} className="px-3 py-1 bg-neutral-900 rounded-full">{format}</span>
                                    ))}
                                </div>
                            </div>

                            {loading && (
                                <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-20">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                        <p className="text-indigo-400 font-mono text-sm animate-pulse">Extracting Deep Metadata...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Transparency Gate */}
                {stagedData && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                        <div className="text-center mb-12">
                            <h2 className="text-5xl font-bold mb-3">The Transparency Gate</h2>
                            <p className="text-neutral-500 text-lg">Review hidden data before your file leaves your device</p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* RAW */}
                            <div className="bg-red-950/10 border border-red-900/30 rounded-3xl overflow-hidden flex flex-col">
                                <div className="p-6 border-b border-red-900/30 bg-red-950/20 flex items-center justify-between sticky top-0 backdrop-blur-xl z-10">
                                    <h3 className="text-red-400 font-bold text-xl flex items-center gap-3">
                                        <span className="text-3xl">🚫</span>
                                        EXPOSED METADATA
                                    </h3>
                                    {(() => {
                                        const { riskScore } = getCategorizedData(stagedData.metadata_raw);
                                        return (
                                            <div className="px-4 py-2 bg-red-900/50 rounded-xl">
                                                <div className="text-xs text-red-300/70 font-mono">Risk Score</div>
                                                <div className="text-2xl font-bold text-red-200">{riskScore}</div>
                                            </div>
                                        );
                                    })()}
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 space-y-8 max-h-[700px] custom-scrollbar">
                                    {(() => {
                                        const { categories } = getCategorizedData(stagedData.metadata_raw);
                                        return Object.entries(categories).map(([category, items]) => (
                                            <div key={category} className="space-y-4">
                                                <h4 className="text-sm font-bold text-red-300/60 uppercase tracking-wider sticky top-0 bg-black/80 backdrop-blur-sm py-2 -mx-2 px-2 rounded-lg">
                                                    {category}
                                                </h4>
                                                <div className="grid gap-3">
                                                    {Object.entries(items).map(([k, v]) => (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            key={k}
                                                            className="bg-red-900/10 p-4 rounded-xl hover:bg-red-900/20 transition border border-red-900/20 group cursor-default"
                                                        >
                                                            <div className="text-xs text-red-400/70 font-mono mb-1 group-hover:text-red-300 transition">{k}</div>
                                                            <div className="text-red-100 font-medium break-words text-sm leading-relaxed">
                                                                {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>

                            {/* CLEAN */}
                            <div className="bg-green-950/10 border border-green-900/30 rounded-3xl overflow-hidden flex flex-col">
                                <div className="p-6 border-b border-green-900/30 bg-green-950/20 sticky top-0 backdrop-blur-xl z-10">
                                    <h3 className="text-green-400 font-bold text-xl flex items-center gap-3">
                                        <span className="text-3xl">🛡️</span>
                                        SANITIZED PREVIEW
                                    </h3>
                                </div>
                                <div className="flex-1 p-8 flex items-center justify-center">
                                    <div className="text-center space-y-6 max-w-md">
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ repeat: Infinity, duration: 3 }}
                                            className="w-32 h-32 bg-green-900/20 rounded-full flex items-center justify-center mx-auto text-6xl"
                                        >
                                            🧼
                                        </motion.div>
                                        <h4 className="text-3xl font-bold text-green-100">Clean & Safe</h4>
                                        <p className="text-green-400/70 leading-relaxed">
                                            All Identity, GPS, Device fingerprints, and tracking data will be completely stripped. Only technical rendering data remains.
                                        </p>
                                        {Object.keys(stagedData.metadata_preview_clean).length > 0 && (
                                            <div className="bg-green-900/10 rounded-xl p-6 text-left text-sm space-y-3 border border-green-900/20">
                                                {Object.entries(stagedData.metadata_preview_clean).map(([k, v]) => (
                                                    <div key={k} className="flex justify-between items-start gap-4">
                                                        <span className="text-green-400/50 font-mono text-xs">{k}</span>
                                                        <span className="text-green-200 font-medium text-right">{String(v)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/95 to-transparent flex justify-center gap-6 z-50 pointer-events-none backdrop-blur-sm">
                            <div className="pointer-events-auto flex gap-4">
                                <button
                                    onClick={() => setStagedData(null)}
                                    className="px-10 py-4 rounded-2xl border-2 border-neutral-700 bg-neutral-900/90 hover:bg-neutral-800 transition text-neutral-300 font-medium backdrop-blur-xl"
                                >
                                    Cancel
                                </button>
                                <ClickSpark sparkColor="#4ade80" sparkCount={12} sparkRadius={20}>
                                    <button
                                        onClick={handleConfirm}
                                        disabled={loading}
                                        className="px-12 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold text-lg shadow-2xl shadow-indigo-900/50 transition-all flex items-center gap-3 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Processing...
                                            </span>
                                        ) : (
                                            <>
                                                <span>Sanitize & Store Securely</span>
                                                <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">ENTER</kbd>
                                            </>
                                        )}
                                    </button>
                                </ClickSpark>
                            </div>
                        </div>

                    </motion.div>
                )}
            </div>
        </main>
    );
}
