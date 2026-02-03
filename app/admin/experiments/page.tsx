export const dynamic = "force-dynamic";

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Plus, Pencil, Trash2, Loader2, Beaker } from "lucide-react";

interface Experiment {
    id: string;
    title: string;
    description: string;
    tech_stack: string[];
    notebook_url: string;
    dataset_url: string;
    status: "In Progress" | "Completed" | "Planned";
}

export default function ExperimentsPage() {
    const [experiments, setExperiments] = useState<Experiment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExp, setEditingExp] = useState<Experiment | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        tech_stack: "",
        notebook_url: "",
        dataset_url: "",
        status: "In Progress"
    });

    useEffect(() => {
        fetchExperiments();
    }, []);

    const fetchExperiments = async () => {
        const { data } = await supabase
            .from("experiments")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) setExperiments(data);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const experimentData = {
            ...formData,
            tech_stack: formData.tech_stack.split(",").map(s => s.trim())
        };

        if (editingExp) {
            await supabase
                .from("experiments")
                .update(experimentData)
                .eq("id", editingExp.id);
        } else {
            await supabase
                .from("experiments")
                .insert([experimentData]);
        }

        setIsModalOpen(false);
        setEditingExp(null);
        setFormData({ title: "", description: "", tech_stack: "", notebook_url: "", dataset_url: "", status: "In Progress" });
        fetchExperiments();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this experiment?")) {
            await supabase.from("experiments").delete().eq("id", id);
            fetchExperiments();
        }
    };

    const openEditModal = (exp: Experiment) => {
        setEditingExp(exp);
        setFormData({
            title: exp.title,
            description: exp.description,
            tech_stack: exp.tech_stack.join(", "),
            notebook_url: exp.notebook_url || "",
            dataset_url: exp.dataset_url || "",
            status: exp.status as any
        });
        setIsModalOpen(true);
    };

    if (loading) return <Loader2 className="animate-spin mx-auto mt-20" />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Data Science Lab</h1>
                <Button onClick={() => {
                    setEditingExp(null);
                    setFormData({ title: "", description: "", tech_stack: "", notebook_url: "", dataset_url: "", status: "In Progress" });
                    setIsModalOpen(true);
                }} icon={<Plus size={20} />}>
                    New Experiment
                </Button>
            </div>

            <div className="grid gap-6">
                {experiments.map((exp) => (
                    <Card key={exp.id} className="p-6 flex justify-between items-center bg-white/5 border-white/10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Beaker className="text-purple-500" size={20} />
                                <h3 className="text-xl font-bold">{exp.title}</h3>
                                <span className={`px-2 py-0.5 text-xs rounded-full border ${exp.status === 'Completed'
                                    ? 'border-green-500/30 text-green-400 bg-green-500/10'
                                    : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
                                    }`}>
                                    {exp.status}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-2 max-w-2xl">{exp.description}</p>
                            <div className="flex gap-2">
                                {exp.tech_stack.map((tech, i) => (
                                    <span key={i} className="text-xs px-2 py-1 bg-black rounded text-gray-500 border border-white/5">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="secondary" size="sm" onClick={() => openEditModal(exp)}>
                                <Pencil size={16} />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(exp.id)} className="text-red-400 border-red-400/30 hover:bg-red-400/10">
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingExp ? "Edit Experiment" : "New Experiment"}
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
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full h-24 bg-black border border-white/10 rounded-lg p-2 focus:border-neon-cyan outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tech Stack (comma separated)</label>
                        <input
                            type="text"
                            value={formData.tech_stack}
                            onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-lg p-2 focus:border-neon-cyan outline-none"
                            placeholder="Python, Pandas, PyTorch"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Notebook URL</label>
                            <input
                                type="url"
                                value={formData.notebook_url}
                                onChange={(e) => setFormData({ ...formData, notebook_url: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-lg p-2 focus:border-neon-cyan outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Dataset URL</label>
                            <input
                                type="url"
                                value={formData.dataset_url}
                                onChange={(e) => setFormData({ ...formData, dataset_url: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-lg p-2 focus:border-neon-cyan outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-lg p-2 focus:border-neon-cyan outline-none"
                        >
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Planned">Planned</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">{editingExp ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
