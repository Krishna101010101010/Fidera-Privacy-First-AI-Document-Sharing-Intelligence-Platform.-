'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

interface Message {
    role: 'user' | 'ai';
    content: string;
}

export default function ViewerPage() {
    const { fileId } = useParams();
    const [fileInfo, setFileInfo] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // AI State
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [streaming, setStreaming] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (fileId) {
            api.getFileInfo(fileId as string)
                .then(setFileInfo)
                .catch(err => setError(err.message));

            // Fetch models
            api.getModels().then(data => {
                setModels(data.models);
                if (data.models.length > 0) setSelectedModel(data.models[0]);
            }).catch(console.error);
        }
    }, [fileId]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || !selectedModel || streaming) return;

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setStreaming(true);

        // Placeholder for AI response
        setMessages(prev => [...prev, { role: 'ai', content: '...' }]);

        try {
            const response = await api.chatStream(fileId as string, userMsg, selectedModel);
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiContent = "";
            let firstChunk = true;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                aiContent += chunk;

                if (firstChunk) {
                    // Replace "..." with actual content on first chunk
                    setMessages(prev => {
                        const newArr = [...prev];
                        newArr[newArr.length - 1] = { role: 'ai', content: aiContent };
                        return newArr;
                    });
                    firstChunk = false;
                } else {
                    // Append content
                    setMessages(prev => {
                        const newArr = [...prev];
                        newArr[newArr.length - 1] = { role: 'ai', content: aiContent };
                        return newArr;
                    });
                }
            }
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { role: 'ai', content: 'Connection Error: Check if Ollama is running.' }]);
        } finally {
            setStreaming(false);
        }
    };

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
                <div className="h-14 border-b border-neutral-800 flex items-center px-4 justify-between bg-neutral-950">
                    <span className="text-sm font-semibold flex items-center gap-2">
                        ✨ Ask AI
                    </span>
                    {/* Model Selector */}
                    <div className="relative">
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="bg-neutral-800 text-xs px-2 py-1 rounded border border-neutral-700 focus:outline-none appearance-none cursor-pointer"
                        >
                            {models.length > 0 ? (
                                models.map(m => <option key={m} value={m}>{m}</option>)
                            ) : (
                                <option value="">No Models Found</option>
                            )}
                        </select>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {models.length === 0 && (
                        <div className="text-center text-xs text-yellow-500 my-4 p-2 border border-yellow-900/50 bg-yellow-900/10 rounded">
                            ⚠️ No Ollama models found. Run `ollama pull llama3` in your terminal.
                        </div>
                    )}

                    {messages.length === 0 && models.length > 0 && (
                        <div className="text-center text-neutral-600 my-10 text-sm">
                            Ready to answer questions about this document.
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-neutral-800 text-neutral-200 rounded-bl-none'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-neutral-800">
                    <div className="flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            disabled={models.length === 0 || streaming}
                            placeholder={models.length === 0 ? "Install a model first..." : "Ask a question..."}
                            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={streaming || !input.trim()}
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 p-2 rounded-lg transition"
                        >
                            🚀
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
