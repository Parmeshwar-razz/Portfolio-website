"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ExternalLink, Award, Calendar } from "lucide-react";
import Image from "next/image";

interface Certificate {
    id: string;
    title: string;
    issuer: string;
    issue_date: string;
    credential_url: string;
    image_url: string;
}

export function Certificates() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);

    useEffect(() => {
        const fetchCertificates = async () => {
            const { data } = await supabase
                .from("certificates")
                .select("*")
                .order("issue_date", { ascending: false });

            if (data) setCertificates(data);
        };

        fetchCertificates();
    }, []);

    if (certificates.length === 0) return null;

    return (
        <section className="py-20 bg-transparent text-white" id="certificates">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neon-cyan/50"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-center">
                        <span className="text-neon-cyan">Certifications</span> & Awards
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neon-cyan/50"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificates.map((cert) => (
                        <div
                            key={cert.id}
                            className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-neon-cyan/50 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="relative aspect-video overflow-hidden">
                                {cert.image_url ? (
                                    <Image
                                        src={cert.image_url}
                                        alt={cert.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-white/5">
                                        <Award size={48} className="text-gray-600" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    {cert.credential_url && (
                                        <a
                                            href={cert.credential_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white flex items-center gap-2 hover:text-neon-cyan transition-colors"
                                        >
                                            View Credential <ExternalLink size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-neon-cyan transition-colors">{cert.title}</h3>
                                <div className="flex justify-between items-center text-sm text-gray-400">
                                    <span className="text-white/80">{cert.issuer}</span>
                                    {cert.issue_date && (
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(cert.issue_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
