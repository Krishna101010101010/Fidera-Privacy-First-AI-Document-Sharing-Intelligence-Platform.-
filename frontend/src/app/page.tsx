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

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4">
          <div className="text-5xl">✅</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">File Secured & Shared</h1>
          <p className="text-neutral-400">Your privacy-sanitized document is ready.</p>
          <div className="flex gap-4 justify-center">
            <Link href={`/view/${stagedData?.file_id}`} className="px-6 py-2 bg-indigo-600 rounded-full hover:bg-indigo-500 font-bold transition">
              View Document (Receive)
            </Link>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-neutral-800 rounded-full hover:bg-neutral-700">
              Send Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-neutral-100 font-sans p-6">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tighter bg-gradient-to-br from-indigo-400 to-purple-600 bg-clip-text text-transparent">
            Fidera.
          </h1>
          <p className="text-lg text-neutral-500">Privacy-First AI Document Sharing</p>
        </div>

        {/* Upload State */}
        {!stagedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="border-2 border-dashed border-neutral-800 rounded-xl p-12 text-center hover:border-indigo-500 transition-colors"
          >
            <input type="file" onChange={handleFileChange} className="block w-full text-sm text-neutral-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100" />
            <p className="mt-4 text-neutral-500">Upload PDF to see the Privacy Gate in action</p>
            {loading && <p className="mt-4 text-indigo-400 animate-pulse">Analyzing Metadata...</p>}
          </motion.div>
        )}

        {/* Transparency Gate */}
        {stagedData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Transparency Gate</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* RAW */}
              <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-6">
                <h3 className="text-red-400 font-mono font-bold mb-4 flex items-center gap-2">
                  🚫 EXPOSED METADATA
                </h3>
                <pre className="text-xs text-red-200 overflow-auto max-h-60 font-mono whitespace-pre-wrap">
                  {JSON.stringify(stagedData.metadata_raw, null, 2)}
                </pre>
              </div>

              {/* CLEAN */}
              <div className="bg-green-950/20 border border-green-900/50 rounded-lg p-6">
                <h3 className="text-green-400 font-mono font-bold mb-4 flex items-center gap-2">
                  🛡️ SANITIZED PREVIEW
                </h3>
                <pre className="text-xs text-green-200 overflow-auto max-h-60 font-mono whitespace-pre-wrap">
                  {JSON.stringify(stagedData.metadata_preview_clean, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => setStagedData(null)}
                className="px-6 py-3 rounded-lg border border-neutral-700 hover:bg-neutral-900 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-bold transition flex items-center gap-2"
              >
                {loading ? "Processing..." : "Sanitize & Securely Store"}
              </button>
            </div>
            <p className="text-center text-xs text-neutral-600 mt-2">
              Expiration set to: 24 Hours
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
