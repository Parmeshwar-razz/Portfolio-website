"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Download, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export function Hero() {
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase
                .from("site_settings")
                .select("resume_url, hero_image_url")
                .single();
            if (data) {
                if (data.resume_url) setResumeUrl(data.resume_url);
                if (data.hero_image_url) setHeroImageUrl(data.hero_image_url);
            }
        };
        fetchSettings();
    }, []);

    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
            {/* Content Overlay */}
            <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neon-cyan text-sm font-medium mb-4 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
                        </span>
                        Open to Data Science Roles
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white drop-shadow-lg">
                        Data Scientist &
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-blue filter drop-shadow hover:brightness-125 transition-all">ML Engineer</span>
                    </h1>

                    <p className="text-gray-300 text-lg max-w-lg mx-auto md:mx-0 drop-shadow-md">
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

                <div className="relative flex justify-center items-center">
                    {/* Glassmorphic Card/Frame for User Image */}
                    <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border-4 border-neon-cyan/30 bg-black/40 backdrop-blur-md overflow-hidden flex items-center justify-center shadow-[0_0_40px_rgba(0,243,255,0.2)] group transition-all duration-500 hover:shadow-[0_0_60px_rgba(0,243,255,0.4)]">

                        <div className="w-full h-full relative">
                            {heroImageUrl ? (
                                <Image
                                    src={heroImageUrl}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-white/50 bg-gradient-to-b from-transparent to-black/80">
                                    <User size={64} className="mb-4 text-neon-cyan opacity-80" />
                                    <span className="text-sm font-medium">Add Your Photo</span>
                                </div>
                            )}
                        </div>

                        {/* Decorative Orbit/Ring */}
                        <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_10s_linear_infinite] opacity-60"></div>
                        <div className="absolute -inset-4 border border-neon-blue/20 rounded-full animate-[spin_15s_linear_infinite_reverse] opacity-40"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}

