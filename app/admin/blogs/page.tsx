export const dynamic = "force-dynamic";

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Plus, Pencil, Trash2, Eye, Loader2 } from "lucide-react";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    category: string;
    content: string;
    read_time: string;
    status: "published" | "draft";
    created_at: string;
}

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        category: "",
        content: "",
        read_time: "",
        status: "published"
    });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        const { data, error } = await supabase
            .from("blogs")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) setBlogs(data);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (editingBlog) {
            await supabase
                .from("blogs")
                .update(formData)
                .eq("id", editingBlog.id);
        } else {
            await supabase
                .from("blogs")
                .insert([formData]);
        }

        setIsModalOpen(false);
        setEditingBlog(null);
        setFormData({ title: "", slug: "", category: "", content: "", read_time: "", status: "published" });
        fetchBlogs();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this post?")) {
            await supabase.from("blogs").delete().eq("id", id);
            fetchBlogs();
        }
    };

    const openEditModal = (blog: BlogPost) => {
        setEditingBlog(blog);
        setFormData({
            title: blog.title,
            slug: blog.slug,
            category: blog.category,
            content: blog.content,
            read_time: blog.read_time,
            status: blog.status
        });
        setIsModalOpen(true);
    };

    if (loading) return <Loader2 className="animate-spin mx-auto mt-20" />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Blog Posts</h1>
                <Button onClick={() => {
                    setEditingBlog(null);
                    setFormData({ title: "", slug: "", category: "", content: "", read_time: "", status: "published" });
                    setIsModalOpen(true);
                }} icon={<Plus size={20} />}>
                    New Post
                </Button>
            </div>

            <div className="grid gap-6">
                {blogs.map((blog) => (
                    <Card key={blog.id} className="p-6 flex justify-between items-center bg-white/5 border-white/10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold">{blog.title}</h3>
                                <span className={`px-2 py-0.5 text-xs rounded-full border ${blog.status === 'published'
                                    ? 'border-green-500/30 text-green-400 bg-green-500/10'
                                    : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
                                    }`}>
                                    {blog.status}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">{blog.category} • {blog.read_time}</p>
                            <p className="text-gray-500 text-sm line-clamp-1">{blog.slug}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="secondary" size="sm" onClick={() => openEditModal(blog)}>
                                <Pencil size={16} />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(blog.id)} className="text-red-400 border-red-400/30 hover:bg-red-400/10">
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingBlog ? "Edit Post" : "New Post"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-lg p-2 focus:border-neon-cyan outline-none"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Slug</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-lg p-2 focus:border-neon-cyan outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-lg p-2 focus:border-neon-cyan outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Read Time</label>
                            <input
                                type="text"
                                value={formData.read_time}
                                onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-lg p-2 focus:border-neon-cyan outline-none"
                                placeholder="e.g. 5 min read"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full bg-black border border-white/10 rounded-lg p-2 focus:border-neon-cyan outline-none"
                            >
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Content</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full h-48 bg-black border border-white/10 rounded-lg p-2 focus:border-neon-cyan outline-none"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">{editingBlog ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
