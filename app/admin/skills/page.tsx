"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Loader2, Plus, Pencil, Trash2, GripVertical, ChevronDown, ChevronRight } from "lucide-react";

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

export default function SkillsPage() {
    const [categories, setCategories] = useState<SkillCategory[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

    // Editing States
    const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    // Form Data
    const [categoryName, setCategoryName] = useState("");
    const [skillName, setSkillName] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        // Fetch Categories
        const { data: cats, error: catError } = await supabase
            .from("skill_categories")
            .select("*")
            .order("order_index", { ascending: true });

        if (catError) {
            console.error("Error fetching categories:", catError);
            setLoading(false);
            return;
        }

        // Fetch Skills
        const { data: skills, error: skillError } = await supabase
            .from("skills")
            .select("*")
            .order("order_index", { ascending: true });

        if (skillError) {
            console.error("Error fetching skills:", skillError);
            setLoading(false);
            return;
        }

        // Combine
        const combined = cats.map(cat => ({
            ...cat,
            skills: skills.filter(s => s.category_id === cat.id)
        }));

        setCategories(combined);
        setLoading(false);
    };

    // --- Category Handlers ---

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            await supabase.from("skill_categories").update({ name: categoryName }).eq("id", editingCategory.id);
        } else {
            const maxOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order_index)) : 0;
            await supabase.from("skill_categories").insert([{ name: categoryName, order_index: maxOrder + 1 }]);
        }
        setIsCategoryModalOpen(false);
        setCategoryName("");
        setEditingCategory(null);
        fetchData();
    };

    const handleDeleteCategory = async (id: string) => {
        if (confirm("Delete this category and all its skills?")) {
            await supabase.from("skill_categories").delete().eq("id", id);
            fetchData();
        }
    };

    // --- Skill Handlers ---

    const handleSaveSkill = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategoryId && !editingSkill) return;

        if (editingSkill) {
            await supabase.from("skills").update({ name: skillName }).eq("id", editingSkill.id);
        } else {
            const category = categories.find(c => c.id === selectedCategoryId);
            const currentSkills = category?.skills || [];
            const maxOrder = currentSkills.length > 0 ? Math.max(...currentSkills.map(s => s.order_index)) : 0;

            await supabase.from("skills").insert([{
                name: skillName,
                category_id: selectedCategoryId,
                order_index: maxOrder + 1
            }]);
        }
        setIsSkillModalOpen(false);
        setSkillName("");
        setEditingSkill(null);
        fetchData();
    };

    const handleDeleteSkill = async (id: string) => {
        if (confirm("Delete this skill?")) {
            await supabase.from("skills").delete().eq("id", id);
            fetchData();
        }
    };

    // --- UI Helpers ---

    const openNewCategoryModal = () => {
        setEditingCategory(null);
        setCategoryName("");
        setIsCategoryModalOpen(true);
    };

    const openEditCategoryModal = (cat: SkillCategory) => {
        setEditingCategory(cat);
        setCategoryName(cat.name);
        setIsCategoryModalOpen(true);
    };

    const openNewSkillModal = (categoryId: string) => {
        setEditingSkill(null);
        setSelectedCategoryId(categoryId);
        setSkillName("");
        setIsSkillModalOpen(true);
    };

    const openEditSkillModal = (skill: Skill) => {
        setEditingSkill(skill);
        setSkillName(skill.name);
        setIsSkillModalOpen(true);
    };

    if (loading) return <Loader2 className="animate-spin mx-auto mt-20" />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Technical Stack</h1>
                    <p className="text-gray-400">Manage your skills and categories.</p>
                </div>
                <Button onClick={openNewCategoryModal} icon={<Plus size={20} />}>
                    New Category
                </Button>
            </div>

            <div className="grid gap-6">
                {categories.map((category) => (
                    <Card key={category.id} className="p-6 bg-white/5 border-white/10">
                        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                            <h3 className="text-xl font-bold text-neon-cyan">{category.name}</h3>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => openEditCategoryModal(category)}>
                                    <Pencil size={16} />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category.id)} className="text-red-400 hover:text-red-300">
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {category.skills?.map((skill) => (
                                <div key={skill.id} className="group flex items-center gap-2 px-3 py-1.5 bg-black border border-white/10 rounded-full hover:border-neon-blue/50 transition-colors">
                                    <span className="text-sm text-gray-300 group-hover:text-white">{skill.name}</span>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity border-l border-white/10 pl-2 ml-1">
                                        <button onClick={() => openEditSkillModal(skill)} className="text-blue-400 hover:text-blue-300">
                                            <Pencil size={12} />
                                        </button>
                                        <button onClick={() => handleDeleteSkill(skill.id)} className="text-red-400 hover:text-red-300">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => openNewSkillModal(category.id)}
                                className="px-3 py-1.5 border border-dashed border-white/20 rounded-full text-sm text-gray-500 hover:text-white hover:border-white/40 transition-colors flex items-center gap-1"
                            >
                                <Plus size={14} /> Add Skill
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Category Modal */}
            <Modal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                title={editingCategory ? "Edit Category" : "New Category"}
            >
                <form onSubmit={handleSaveCategory} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Category Name</label>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 focus:border-neon-blue outline-none text-white"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="ghost" onClick={() => setIsCategoryModalOpen(false)}>Cancel</Button>
                        <Button type="submit">{editingCategory ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </Modal>

            {/* Skill Modal */}
            <Modal
                isOpen={isSkillModalOpen}
                onClose={() => setIsSkillModalOpen(false)}
                title={editingSkill ? "Edit Skill" : "New Skill"}
            >
                <form onSubmit={handleSaveSkill} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Skill Name</label>
                        <input
                            type="text"
                            value={skillName}
                            onChange={(e) => setSkillName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 focus:border-neon-blue outline-none text-white"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="ghost" onClick={() => setIsSkillModalOpen(false)}>Cancel</Button>
                        <Button type="submit">{editingSkill ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
