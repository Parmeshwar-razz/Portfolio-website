export const dynamic = "force-dynamic";

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { Loader2, Eye, EyeOff, GripVertical, ArrowUp, ArrowDown } from "lucide-react";

interface Section {
    id: string;
    name: string;
    is_visible: boolean;
    order_index: number;
}

export default function SectionsPage() {
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [reordering, setReordering] = useState(false);

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        const { data } = await supabase
            .from("sections")
            .select("*")
            .order("order_index", { ascending: true });

        if (data) setSections(data);
        setLoading(false);
    };

    const toggleVisibility = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from("sections")
            .update({ is_visible: !currentStatus })
            .eq("id", id);

        if (!error) {
            setSections(sections.map(s =>
                s.id === id ? { ...s, is_visible: !currentStatus } : s
            ));
        }
    };

    const moveSection = async (index: number, direction: 'up' | 'down') => {
        if (reordering) return;
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === sections.length - 1) return;

        setReordering(true);
        const newSections = [...sections];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap in local state first for immediate feedback
        const temp = newSections[index];
        newSections[index] = newSections[targetIndex];
        newSections[targetIndex] = temp;
        setSections(newSections);

        try {
            // Swap order_index in DB
            const currentSection = sections[index];
            const targetSection = sections[targetIndex];

            // We need to update both rows. 
            // To avoid unique constraint errors (if any), we might need a transaction or careful updating.
            // Assuming no strict unique constraint on order_index for now or simple swap works.

            await supabase
                .from("sections")
                .update({ order_index: targetSection.order_index })
                .eq("id", currentSection.id);

            await supabase
                .from("sections")
                .update({ order_index: currentSection.order_index })
                .eq("id", targetSection.id);

            // Refetch to ensure sync
            await fetchSections();
        } catch (error) {
            console.error("Error reordering sections:", error);
            fetchSections(); // Revert on error
        } finally {
            setReordering(false);
        }
    };

    if (loading) return <Loader2 className="animate-spin mx-auto mt-20" />;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Section Management</h1>
            <p className="text-gray-400">Control visibility and order of sections on your portfolio.</p>

            <div className="grid gap-4 max-w-2xl">
                {sections.map((section, index) => (
                    <Card key={section.id} className="p-4 flex items-center justify-between bg-white/5 border-white/10 transition-all hover:border-white/20">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col gap-1">
                                <button
                                    onClick={() => moveSection(index, 'up')}
                                    disabled={index === 0 || reordering}
                                    className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ArrowUp size={16} />
                                </button>
                                <button
                                    onClick={() => moveSection(index, 'down')}
                                    disabled={index === sections.length - 1 || reordering}
                                    className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ArrowDown size={16} />
                                </button>
                            </div>
                            <span className="font-bold text-lg">{section.name}</span>
                        </div>

                        <button
                            onClick={() => toggleVisibility(section.id, section.is_visible)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${section.is_visible
                                ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                }`}
                        >
                            {section.is_visible ? (
                                <>
                                    <Eye size={18} /> Visible
                                </>
                            ) : (
                                <>
                                    <EyeOff size={18} /> Hidden
                                </>
                            )}
                        </button>
                    </Card>
                ))}
            </div>
        </div>
    );
}
