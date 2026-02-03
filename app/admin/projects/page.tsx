"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Loader2, Plus, Pencil, Trash2, Github, ExternalLink, Eye, EyeOff, Upload, Image as ImageIcon } from "lucide-react";
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
    status: 'active' | 'hidden';
}

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<Partial<Project>>({
        title: "",
        category: "Full Stack",
        tech_stack: [],
        description: "",
        github_url: "",
        live_url: "",
        image_url: "",
        status: "active",
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) console.error("Error fetching projects:", error);
        else setProjects(data || []);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingProject) {
                const { error } = await supabase
                    .from("projects")
                    .update(formData)
                    .eq("id", editingProject.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("projects")
                    .insert([formData]);
                if (error) throw error;
            }

            setIsModalOpen(false);
            setEditingProject(null);
            resetForm();
            fetchProjects();
        } catch (error) {
            console.error("Error saving project:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) console.error("Error deleting project:", error);
        else fetchProjects();
    };

    const toggleStatus = async (project: Project) => {
        const newStatus = project.status === 'active' ? 'hidden' : 'active';
        setProjects(projects.map(p => p.id === project.id ? { ...p, status: newStatus } : p));

        const { error } = await supabase
            .from("projects")
            .update({ status: newStatus })
            .eq("id", project.id);

        if (error) {
            console.error("Error updating status:", error);
            fetchProjects();
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `project-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        setUploading(true);

        const { error: uploadError } = await supabase.storage
            .from('projects') // Make sure this bucket exists
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            alert('Failed to upload image. Make sure the "projects" bucket exists and is public.');
            setUploading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('projects')
            .getPublicUrl(filePath);

        setFormData(prev => ({ ...prev, image_url: publicUrl }));
        setUploading(false);
    };

    const resetForm = () => {
        setFormData({
            title: "",
            category: "Full Stack",
            tech_stack: [],
            description: "",
            github_url: "",
            live_url: "",
            image_url: "",
            status: "active",
        });
    };

    const openEditModal = (project: Project) => {
        setEditingProject(project);
        setFormData(project);
        setIsModalOpen(true);
    };

    const openNewModal = () => {
        setEditingProject(null);
        resetForm();
        setIsModalOpen(true);
    };

    if (loading && projects.length === 0) return <Loader2 className="animate-spin text-neon-cyan mx-auto mt-20" />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Project Manager</h1>
                    <p className="text-gray-400">Manage your portfolio projects.</p>
                </div>
                <button
                    onClick={openNewModal}
                    className="px-4 py-2 bg-neon-blue text-white font-bold rounded-lg hover:bg-neon-blue/80 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} /> New Project
                </button>
            </div>

            <div className="grid gap-4">
                {projects.map((project) => (
                    <Card key={project.id} className="p-6 flex flex-col md:flex-row gap-6 border-l-4 border-l-neon-blue bg-white/5 border-white/10 hover:border-white/20 transition-all">
                        {/* Image Preview in List */}
                        <div className="relative w-full md:w-48 aspect-video bg-black/50 rounded-lg overflow-hidden border border-white/10 shrink-0">
                            {project.image_url ? (
                                <Image
                                    src={project.image_url}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-600">
                                    <ImageIcon size={32} />
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold">{project.title}</h3>
                                <span className={`px-2 py-0.5 text-xs rounded-full border ${project.status === 'active'
                                    ? 'border-green-500/30 text-green-400 bg-green-500/10'
                                    : 'border-gray-500/30 text-gray-400 bg-gray-500/10'
                                    }`}>
                                    {project.status.toUpperCase()}
                                </span>
                                <span className="text-sm text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded">
                                    {project.category}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                            <div className="flex gap-2 flex-wrap">
                                {project.tech_stack.map((tech, i) => (
                                    <span key={i} className="text-xs text-gray-400 bg-black border border-white/10 px-2 py-1 rounded">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-start md:self-center">
                            <button
                                onClick={() => toggleStatus(project)}
                                className={`p-2 rounded transition-colors ${project.status === 'active'
                                    ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                    }`}
                                title="Toggle Visibility"
                            >
                                {project.status === 'active' ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>

                            <button
                                onClick={() => openEditModal(project)}
                                className="p-2 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 transition-colors"
                                title="Edit"
                            >
                                <Pencil size={18} />
                            </button>

                            <button
                                onClick={() => handleDelete(project.id)}
                                className="p-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProject ? "Edit Project" : "New Project"}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    {/* Image Upload Section */}
                    <div className="flex justify-center mb-6">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-48 bg-white/5 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-neon-blue/50 transition-colors relative overflow-hidden group"
                        >
                            {formData.image_url ? (
                                <>
                                    <Image
                                        src={formData.image_url}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white font-bold">Click to Change</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {uploading ? <Loader2 className="animate-spin mb-2" /> : <Upload className="mb-2" />}
                                    <span className="text-sm text-gray-400">Click to upload project image</span>
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 focus:border-neon-blue outline-none text-white"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 focus:border-neon-blue outline-none text-white"
                            >
                                <option value="Full Stack">Full Stack</option>
                                <option value="Data Science">Data Science</option>
                                <option value="Machine Learning">Machine Learning</option>
                                <option value="Frontend">Frontend</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'hidden' })}
                                className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 focus:border-neon-blue outline-none text-white"
                            >
                                <option value="active">Active</option>
                                <option value="hidden">Hidden</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Tech Stack (comma separated)</label>
                        <input
                            type="text"
                            value={formData.tech_stack?.join(", ")}
                            onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value.split(",").map(t => t.trim()) })}
                            className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 focus:border-neon-blue outline-none text-white"
                            placeholder="React, Node.js, Python"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 focus:border-neon-blue outline-none text-white h-32"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">GitHub URL</label>
                            <input
                                type="url"
                                value={formData.github_url}
                                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 focus:border-neon-blue outline-none text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Live URL</label>
                            <input
                                type="url"
                                value={formData.live_url}
                                onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 focus:border-neon-blue outline-none text-white"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="w-full py-3 rounded-lg bg-neon-blue text-white font-bold hover:bg-neon-blue/80 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (editingProject ? "Update Project" : "Create Project")}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
