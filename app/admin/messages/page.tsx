"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { Loader2, Mail, Calendar, CheckCircle, XCircle } from "lucide-react";

interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    created_at: string;
    status: "unread" | "read";
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        const { data } = await supabase
            .from("messages")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) setMessages(data);
        setLoading(false);
    };

    const markAsRead = async (id: string) => {
        await supabase.from("messages").update({ status: "read" }).eq("id", id);
        setMessages(messages.map(m => m.id === id ? { ...m, status: "read" } : m));
    };

    if (loading) return <Loader2 className="animate-spin mx-auto mt-20" />;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Messages</h1>

            <div className="grid gap-4">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">No messages yet.</div>
                ) : (
                    messages.map((msg) => (
                        <Card key={msg.id} className={`p-6 bg-white/5 border-white/10 ${msg.status === 'unread' ? 'border-l-4 border-l-neon-cyan' : ''}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/10 rounded-full">
                                        <Mail size={20} className="text-gray-300" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{msg.name}</h3>
                                        <p className="text-sm text-gray-400">{msg.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Calendar size={12} />
                                        {new Date(msg.created_at).toLocaleDateString()}
                                    </span>
                                    {msg.status === 'unread' && (
                                        <button
                                            onClick={() => markAsRead(msg.id)}
                                            className="text-xs text-neon-cyan hover:underline"
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-300 bg-black/30 p-4 rounded-lg">
                                {msg.message}
                            </p>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
