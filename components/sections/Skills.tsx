"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface SkillCategory {
    id: string;
    name: string;
    order_index: number;
    skills?: Skill[];
}

interface Skill {
    id: string;
    name: string;
    category_id: string;
    order_index: number;
}

export function Skills() {
    const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch Categories
            const { data: cats } = await supabase
                .from("skill_categories")
                .select("*")
                .order("order_index", { ascending: true });

            if (!cats) {
                setLoading(false);
                return;
            }

            // Fetch Skills
            const { data: skills } = await supabase
                .from("skills")
                .select("*")
                .order("order_index", { ascending: true });

            // Combine
            const combined = cats.map(cat => ({
                ...cat,
                skills: skills?.filter(s => s.category_id === cat.id) || []
            }));

            setSkillCategories(combined);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) return null; // Or a skeleton loader

    return (
        <section id="skills" className="py-20 bg-transparent">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-4 mb-16">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neon-blue/50"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-center">
                        Technical <span className="text-neon-blue">Stack</span>
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neon-blue/50"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {skillCategories.map((category) => (
                        <div key={category.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-neon-blue/30 transition-all duration-300 hover:-translate-y-1 group">
                            <h3 className="text-xl font-bold mb-6 text-neon-cyan border-b border-white/10 pb-2 group-hover:text-neon-blue transition-colors">
                                {category.name}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {category.skills?.map((skill) => (
                                    <span
                                        key={skill.id}
                                        className="px-3 py-1 text-sm bg-black border border-white/10 rounded-full text-gray-300 hover:text-white hover:border-neon-blue/50 transition-colors cursor-default hover:scale-105 transform duration-200"
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
