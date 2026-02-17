"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { DataScienceLab } from "@/components/sections/DataScienceLab";
import { Blog } from "@/components/sections/Blog";
import { Contact } from "@/components/sections/Contact";
import { Certificates } from "@/components/sections/Certificates";
import { Loader2 } from "lucide-react";

const sectionComponents: { [key: string]: React.ComponentType<any> } = {
    "Hero": Hero,
    "About": About,
    "Skills": Skills,
    "Projects": Projects,
    "Data Science Lab": DataScienceLab,
    "Blog": Blog,
    "Contact": Contact,
    "Certificates": Certificates,
};

export default function Home() {
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSections = async () => {
            const { data, error } = await supabase
                .from("sections")
                .select("*")
                .order("order_index", { ascending: true });

            if (!error && data) {
                setSections(data);
            } else {
                // Fallback if DB is empty or error
                console.error("Error fetching sections, using default order:", error);
                setSections([
                    { name: "Hero", is_visible: true },
                    { name: "About", is_visible: true },
                    { name: "Skills", is_visible: true },
                    { name: "Projects", is_visible: true },
                    { name: "Data Science Lab", is_visible: true },
                    { name: "Blog", is_visible: true },
                    { name: "Certificates", is_visible: true },
                    { name: "Contact", is_visible: true },
                ]);
            }
            setLoading(false);
        };

        fetchSections();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="animate-spin text-white" size={48} />
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {sections.map((section) => {
                if (!section.is_visible) return null;
                const Component = sectionComponents[section.name];
                return Component ? <Component key={section.name} /> : null;
            })}
        </div>
    );
}
