"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Download, Database, Brain, LineChart } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function Hero() {
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchResume = async () => {
            const { data } = await supabase
                .from("site_settings")
                .select("resume_url")
                .single();
            if (data?.resume_url) {
                setResumeUrl(data.resume_url);
            }
        };
        fetchResume();
    }, []);

    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-neon-blue/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[100px]"></div>
                {/* Data Grid Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neon-cyan text-sm font-medium mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
                        </span>
                        Open to Data Science Roles
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                        Data Scientist &
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-blue">ML Engineer</span>
                    </h1>

                    <p className="text-gray-400 text-lg max-w-lg mx-auto md:mx-0">
                        Transforming complex data into actionable insights. Specializing in Machine Learning, Predictive Analytics, and building scalable AI solutions.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Button size="lg" icon={<ArrowRight size={20} />} onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
                            View Analysis
                        </Button>
                        {resumeUrl && (
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="secondary" size="lg" icon={<Download size={20} />}>
                                    Download Resume
                                </Button>
                            </a>
                        )}
                    </div>
                </div>

                <div className="relative">
                    <div className="relative w-full aspect-square max-w-md mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue to-neon-cyan rounded-full opacity-20 blur-2xl animate-pulse"></div>
                        <div className="relative w-full h-full rounded-full border-2 border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden flex items-center justify-center group">
                            {/* Animated Data Icons */}
                            <div className="absolute top-1/4 left-1/4 p-3 bg-black/80 rounded-xl border border-white/10 text-neon-cyan animate-bounce delay-100">
                                <Database size={24} />
                            </div>
                            <div className="absolute top-1/3 right-1/4 p-3 bg-black/80 rounded-xl border border-white/10 text-neon-blue animate-bounce delay-300">
                                <Brain size={24} />
                            </div>
                            <div className="absolute bottom-1/3 left-1/3 p-3 bg-black/80 rounded-xl border border-white/10 text-purple-500 animate-bounce delay-500">
                                <LineChart size={24} />
                            </div>

                            <span className="text-8xl filter drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">📊</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
