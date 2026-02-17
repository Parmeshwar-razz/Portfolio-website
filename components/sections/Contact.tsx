"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Send, Mail, MapPin, Phone } from "lucide-react";

export function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from("messages")
            .insert([formData]);

        if (!error) {
            setSuccess(true);
            setFormData({ name: "", email: "", message: "" });
            setTimeout(() => setSuccess(false), 5000);
        }
        setLoading(false);
    };

    return (
        <section id="contact" className="py-20 bg-transparent relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex items-center gap-4 mb-16">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-center">
                        Get In <span className="text-white">Touch</span>
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    <div className="space-y-8">
                        <h3 className="text-2xl font-bold">Let's talk about your project</h3>
                        <p className="text-gray-400">
                            I'm always interested in hearing about new projects and opportunities.
                            Whether you have a question or just want to say hi, feel free to drop a message!
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="p-3 bg-white/5 rounded-lg text-white">
                                    <Mail size={20} />
                                </div>
                                <span>parmeshwarrazz6221@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="p-3 bg-white/5 rounded-lg text-white">
                                    <MapPin size={20} />
                                </div>
                                <span>Remote / Worldwide</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-white/50 outline-none text-white transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-white/50 outline-none text-white transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-white/50 outline-none text-white transition-colors h-32 resize-none"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={loading}
                            icon={!loading && <Send size={18} />}
                        >
                            {success ? "Message Sent!" : "Send Message"}
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
}
