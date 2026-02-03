"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Github, ExternalLink, Folder } from "lucide-react";
import Image from "next/image";

interface Project {
    id: string;
    title: string;
    category: string;
    tech_stack: string[];
    description: string;
    github_url: string;
    live_url: string;
    image_url: string;
}

export function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const { data } = await supabase
                .from("projects")
                .select("*")
                .eq("status", "active")
                .order("created_at", { ascending: false });

            if (data) setProjects(data);
        };
        fetchProjects();
    }, []);

    return (
        <section id="projects" className="py-20 bg-black">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-4 mb-16">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neon-cyan/50"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-center">
                        Featured <span className="text-neon-cyan">Projects</span>
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neon-cyan/50"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <div key={project.id} className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-neon-cyan/50 transition-all duration-300 hover:-translate-y-2">
                                <div className="relative aspect-video overflow-hidden bg-black">
                                    {project.image_url ? (
                                        <Image
                                            src={project.image_url}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-600">
                                            <Folder size={48} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                                        {project.github_url && (
                                            <a href={project.github_url} target="_blank" rel="noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-neon-cyan hover:text-black transition-colors">
                                                <Github size={20} />
                                            </a>
                                        )}
                                        {project.live_url && (
                                            <a href={project.live_url} target="_blank" rel="noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-neon-cyan hover:text-black transition-colors">
                                                <ExternalLink size={20} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="text-xs text-neon-cyan mb-2 font-mono">{project.category}</div>
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-neon-cyan transition-colors">{project.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {project.tech_stack.map((tech, i) => (
                                            <span key={i} className="text-xs px-2 py-1 bg-black rounded text-gray-300 border border-white/5">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            <p>No projects found. Add some from the Admin Panel!</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
