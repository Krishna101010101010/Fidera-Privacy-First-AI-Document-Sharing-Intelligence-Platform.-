'use client';

import { useState } from 'react';
import { api, FileMetadataResponse } from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">File Secured & Shared</h1>
          <p className="text-neutral-400 text-lg">Your data has been sanitized, encrypted, and is ready for safe transmission.</p>

          <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 mt-8 max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-neutral-500 mb-2">
              <span>Sanitization</span>
              <span className="text-green-400">Complete</span>
            </div>
            <div className="flex items-center justify-between text-sm text-neutral-500 mb-2">
              <span>Storage</span>
              <span className="text-green-400">Encrypted (AES-256)</span>
            </div>
            <div className="flex items-center justify-between text-sm text-neutral-500">
              <span>AI Context</span>
              <span className="text-indigo-400">Ready</span>
            </div>
          </div>

          <div className="flex gap-4 justify-center mt-8">
            <Link href={`/view/${stagedData?.file_id}`} className="px-8 py-3 bg-indigo-600 rounded-full hover:bg-indigo-500 font-bold text-lg shadow-lg shadow-indigo-900/20 transition transform hover:-translate-y-1">
              View Document (Receive)
            </Link>
            <button onClick={() => window.location.reload()} className="px-8 py-3 bg-neutral-800 rounded-full hover:bg-neutral-700 font-medium transition">
              Process Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-neutral-100 font-sans p-6 selection:bg-indigo-500/30">
      <div className="max-w-6xl w-full space-y-8">
        {/* Header */}
        {!stagedData && (
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent pb-2">
              Fidera.
            </h1>
            <p className="text-xl text-neutral-500 max-w-2xl mx-auto">
              The Privacy-First AI Intelligence Platform. <br />
              <span className="text-indigo-400">Upload. Sanitize. Chat.</span>
            </p>
          </div>
        )}

        {/* Upload State */}
        {!stagedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto border-2 border-dashed border-neutral-800 rounded-3xl p-16 text-center hover:border-indigo-500 hover:bg-neutral-900/30 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition duration-500" />

            <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />

            <div className="relative z-0 space-y-4">
              <div className="w-16 h-16 bg-neutral-800 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition duration-300 shadow-xl">
                <svg className="w-8 h-8 text-neutral-400 group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-300 group-hover:text-white">Drop your Document here</h3>
              <p className="text-neutral-500 text-sm">PDF, DOCX, Images supported</p>
            </div>

            {loading && (
              <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center z-20">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-indigo-400 font-mono text-sm">Extracting Deep Metadata...</p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Transparency Gate */}
        {stagedData && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold">The Transparency Gate</h2>
              <p className="text-neutral-500">Review hidden data before your file leaves your device.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* RAW - The new Beautiful Grid */}
              <div className="bg-red-950/10 border border-red-900/30 rounded-2xl overflow-hidden flex flex-col h-[600px]">
                <div className="p-4 border-b border-red-900/30 bg-red-950/20 flex items-center justify-between">
                  <h3 className="text-red-400 font-bold flex items-center gap-2">
                    🚫 EXPOSED METADATA
                  </h3>
                  {(() => {
                    const { riskScore } = getCategorizedData(stagedData.metadata_raw);
                    return (
                      <div className="flex gap-2 text-xs font-mono">
                        <span className="px-2 py-1 bg-red-900/50 rounded text-red-200">
                          Risk Score: {riskScore}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {(() => {
                    const { categories } = getCategorizedData(stagedData.metadata_raw);
                    return Object.entries(categories).map(([category, items]) => (
                      <div key={category} className="space-y-3">
                        <h4 className="text-xs font-bold text-red-300/50 uppercase tracking-wider sticky top-0 bg-neutral-950/50 backdrop-blur-sm py-1">
                          {category}
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {Object.entries(items).map(([k, v]) => (
                            <div key={k} className="flex flex-col bg-red-900/10 p-2 rounded hover:bg-red-900/20 transition border border-red-900/10">
                              <span className="text-[10px] text-red-400/70 font-mono">{k}</span>
                              <span className="text-sm text-red-100 font-medium break-words">
                                {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* CLEAN */}
              <div className="bg-green-950/10 border border-green-900/30 rounded-2xl overflow-hidden flex flex-col h-[600px]">
                <div className="p-4 border-b border-green-900/30 bg-green-950/20">
                  <h3 className="text-green-400 font-bold flex items-center gap-2">
                    🛡️ SANITIZED PREVIEW
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
                  <div className="text-center space-y-4 max-w-xs">
                    <div className="w-20 h-20 bg-green-900/20 rounded-full flex items-center justify-center mx-auto text-4xl">
                      🧼
                    </div>
                    <h4 className="text-xl font-bold text-green-100">Clean & Safe</h4>
                    <p className="text-sm text-green-400/70">
                      All Identity, GPS, and Device fingerprints will be stripped. Only technical data required for rendering remains.
                    </p>
                    <div className="bg-green-900/10 rounded-lg p-4 text-left text-xs text-green-200 font-mono space-y-2 border border-green-900/20">
                      {Object.entries(stagedData.metadata_preview_clean).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="opacity-50">{k}</span>
                          <span>{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-neutral-950 to-transparent flex justify-center gap-4 z-50 pointer-events-none">
              <div className="pointer-events-auto flex gap-4">
                <button
                  onClick={() => setStagedData(null)}
                  className="px-8 py-3 rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 transition text-neutral-300 font-medium backdrop-blur-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-xl shadow-indigo-900/50 transition flex items-center gap-3"
                >
                  {loading ? (
                    <>Processing...</> // Spinner here if needed
                  ) : (
                    <>
                      <span>Sanitize & Securely Store</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded text-xs">ENTER</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </div>
    </main>
  );
}
