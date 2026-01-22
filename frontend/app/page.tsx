"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, Shield, ShieldCheck,
  Trash2, MessageSquare, Send, X, RefreshCw,
  AlertTriangle, CheckCircle, Lock, Eye
} from "lucide-react";

// API Configuration
const API_URL = "http://localhost:8000/api/v1";

interface FileData {
  id: string;
  filename: string;
  filesize: number;
  content_type: string;
  created_at: string;
  status: string; // STAGING, STORED, EXPIRED
  is_sanitized: boolean;
  metadata_snapshot: any;
  storage_path: string;
}

export default function FideraDashboard() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Selected File State
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);

  // Chat State
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string, content: string }[]>([]);
  const [isChatting, setIsChatting] = useState(false);

  useEffect(() => {
    // Mock initial fetch or implement real fetch if endpoint exists
    // For now, we rely on uploading new files to populate the list locally 
    // unless we implement the dashboard endpoint fully.
    // Let's try to fetch if we can.
    // fetchFiles();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const res = await axios.post(`${API_URL}/files/stage`, formData);
      const newFile = {
        id: res.data.file_id,
        filename: res.data.filename,
        metadata_snapshot: res.data.metadata_raw,
        status: "STAGING",
        is_sanitized: false,
        // Mocking missing fields for simpler UI
        filesize: 0,
        content_type: "application/octet-stream",
        created_at: new Date().toISOString(),
        storage_path: ""
      };

      setFiles(prev => [newFile, ...prev]);
      setSelectedFile(newFile);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed! Is backend running?");
    } finally {
      setUploading(false);
    }
  };

  const handleSanitizeAndStore = async (file: FileData) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/files/${file.id}/confirm`, null, {
        params: { expiry_hours: 24 }
      });

      // Update local state
      setFiles(prev => prev.map(f =>
        f.id === file.id
          ? { ...f, status: "STORED", is_sanitized: true }
          : f
      ));

      if (selectedFile?.id === file.id) {
        setSelectedFile(prev => prev ? { ...prev, status: "STORED", is_sanitized: true } : null);
      }

    } catch (err) {
      console.error("Sanitization failed", err);
      alert("Sanitization failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !selectedFile) return;

    const userMsg = chatMessage;
    setChatMessage("");
    setChatHistory(prev => [...prev, { role: "user", content: userMsg }]);
    setIsChatting(true);

    try {
      const response = await fetch(`${API_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_id: selectedFile.id,
          message: userMsg,
          model: "llama3" // Default model
        })
      });

      if (!response.body) return;

      // Handle Streaming
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMsg = "";

      setChatHistory(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        aiMsg += chunk;

        setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].content = aiMsg;
          return newHistory;
        });
      }

    } catch (err) {
      console.error("Chat failed", err);
      setChatHistory(prev => [...prev, { role: "system", content: "Error: Could not reach Fidera AI." }]);
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 p-6 flex gap-6 font-sans">

      {/* LEFT PANEL: Files & Upload */}
      <div className="w-1/3 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded font-bold text-xl">F</div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Fidera <span className="text-gray-500 font-normal text-base">Dashboard</span></h1>
        </div>

        {/* Upload Zone */}
        <div className="relative group">
          <input
            type="file"
            onChange={handleUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={uploading}
          />
          <div className={`
            border-2 border-dashed border-gray-800 rounded-xl p-8 text-center transition-all
            group-hover:border-gray-600 group-hover:bg-white/5
            ${uploading ? "opacity-50" : ""}
          `}>
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-gray-900 rounded-full">
                {uploading ? <RefreshCw className="animate-spin text-white" /> : <Upload className="text-white" />}
              </div>
            </div>
            <p className="text-sm text-gray-400">
              {uploading ? "Uploading & extracting metadata..." : "Drop critical documents here"}
            </p>
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Recent Files</h2>

          {files.map(file => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedFile(file)}
              className={`
                p-4 rounded-lg cursor-pointer border transition-all
                ${selectedFile?.id === file.id
                  ? "bg-white/10 border-white/30"
                  : "bg-gray-900/50 border-transparent hover:border-gray-700"}
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <FileText className="text-gray-400 w-5 h-5" />
                  <div>
                    <h3 className="text-sm font-medium text-white truncate max-w-[150px]">{file.filename}</h3>
                    <p className="text-xs text-gray-500">{file.status}</p>
                  </div>
                </div>
                {file.is_sanitized ? (
                  <ShieldCheck className="text-green-500 w-4 h-4" />
                ) : (
                  <AlertTriangle className="text-amber-500 w-4 h-4" />
                )}
              </div>
            </motion.div>
          ))}

          {files.length === 0 && (
            <div className="text-center py-10 text-gray-700 text-sm">No files yet. Upload one.</div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Details & Chat */}
      <div className="flex-1 bg-gray-900/30 rounded-2xl border border-gray-800 p-6 flex flex-col relative overflow-hidden">

        {!selectedFile ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
            <Shield className="w-16 h-16 mb-4 opacity-20" />
            <p>Select a file to inspect or chat with AI</p>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-800">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-white">{selectedFile.filename}</h2>
                <span className={`px-2 py-0.5 rounded text-xs font-mono 
                  ${selectedFile.is_sanitized ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}
                `}>
                  {selectedFile.status}
                </span>
              </div>

              {!selectedFile.is_sanitized && (
                <button
                  onClick={() => handleSanitizeAndStore(selectedFile)}
                  disabled={loading}
                  className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  Sanitize & Save
                </button>
              )}
            </div>

            <div className="flex-1 flex gap-6 min-h-0">

              {/* Column 1: Metadata / Content */}
              <div className="w-1/2 overflow-y-auto pr-2 custom-scrollbar">
                <h3 className="text-sm text-gray-400 mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> EXPOSED METADATA
                </h3>

                {selectedFile.is_sanitized ? (
                  <div className="bg-green-500/5 border border-green-500/20 p-6 rounded-lg text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h4 className="text-green-400 font-bold mb-2">Metadata Stripped</h4>
                    <p className="text-sm text-green-400/70">
                      This document is now safe for sharing. All hidden metadata handles have been removed.
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg overflow-hidden">
                    <pre className="p-4 text-xs font-mono text-red-300 overflow-x-auto">
                      {JSON.stringify(selectedFile.metadata_snapshot, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Column 2: RAG Chat */}
              <div className="w-1/2 flex flex-col bg-black/40 rounded-xl border border-gray-800 overflow-hidden">
                <div className="p-3 bg-gray-900/50 border-b border-gray-800 text-xs font-bold text-gray-500 flex justify-between">
                  <span>FIDERA INTELLIGENCE</span>
                  {selectedFile.is_sanitized && <span className="text-green-500">ACTIVE</span>}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`
                        max-w-[85%] p-3 rounded-lg text-sm
                        ${msg.role === "user"
                          ? "bg-white text-black"
                          : "bg-gray-800 text-gray-200 font-mono text-xs"}
                      `}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isChatting && <div className="text-xs text-gray-500 animate-pulse">Thinking...</div>}
                </div>

                <div className="p-3 border-t border-gray-800 bg-gray-900/30">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder={selectedFile.is_sanitized ? "Ask about this document..." : "Sanitize first to chat"}
                      disabled={!selectedFile.is_sanitized || isChatting}
                      className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white placeholder-gray-600"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!selectedFile.is_sanitized || isChatting}
                      className="text-gray-400 hover:text-white disabled:opacity-30"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}
