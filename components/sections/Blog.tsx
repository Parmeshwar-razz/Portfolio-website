"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    category: string;
    content: string;
    read_time: string;
    created_at: string;
}

export function Blog() {
    const [posts, setPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const { data } = await supabase
                .from("blogs")
                .select("*")
                .eq("status", "published")
                .order("created_at", { ascending: false })
                .limit(3);

            if (data) setPosts(data);
        };
        fetchPosts();
    }, []);

    if (posts.length === 0) return null;

    return (
        <section id="blog" className="py-20 bg-black/50">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-4 mb-16">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-center">
                        Latest <span className="text-white">Articles</span>
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <article key={post.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/30 active:border-white/30 transition-all group">
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                <span className="text-gray-300 bg-white/10 px-2 py-1 rounded">{post.category}</span>
                                <span className="flex items-center gap-1"><Clock size={12} /> {post.read_time}</span>
                            </div>

                            <h3 className="text-xl font-bold mb-3 text-white transition-colors line-clamp-2">
                                {post.title}
                            </h3>

                            <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                                {post.content.substring(0, 150)}...
                            </p>

                            <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white active:text-white transition-colors">
                                Read More <ArrowRight size={16} />
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
