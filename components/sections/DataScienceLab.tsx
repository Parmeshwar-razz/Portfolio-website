"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Beaker, Database, FileCode } from "lucide-react";

interface Experiment {
    id: string;
    title: string;
    description: string;
    tech_stack: string[];
    notebook_url: string;
    dataset_url: string;
    status: string;
}

export function DataScienceLab() {
    const [experiments, setExperiments] = useState<Experiment[]>([]);

    useEffect(() => {
        const fetchExperiments = async () => {
            const { data } = await supabase
                .from("experiments")
                .select("*")
                .order("created_at", { ascending: false });

            if (data) setExperiments(data);
        };
        fetchExperiments();
    }, []);

    return (
        <section id="lab" className="py-20 bg-transparent relative">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-4 mb-16">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-500/50"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-center">
                        Data Science <span className="text-purple-500">Lab</span>
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-500/50"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {experiments.map((exp) => (
                        <div key={exp.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/30 active:border-purple-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400 group-hover:bg-purple-500 group-active:bg-purple-500 group-hover:text-white group-active:text-white transition-colors">
                                    <Beaker size={24} />
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full border ${exp.status === 'Completed'
                                    ? 'border-green-500/30 text-green-400 bg-green-500/10'
                                    : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
                                    }`}>
                                    {exp.status}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 group-active:text-purple-400 transition-colors">{exp.title}</h3>
                            <p className="text-gray-400 text-sm mb-4">{exp.description}</p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {exp.tech_stack.map((tech, i) => (
                                    <span key={i} className="text-xs px-2 py-1 bg-black rounded text-gray-300 border border-white/5">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-white/10">
                                {exp.notebook_url && (
                                    <a href={exp.notebook_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white active:text-white transition-colors">
                                        <FileCode size={16} /> Notebook
                                    </a>
                                )}
                                {exp.dataset_url && (
                                    <a href={exp.dataset_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white active:text-white transition-colors">
                                        <Database size={16} /> Dataset
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
