"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    Beaker,
    Layers,
    MessageSquare,
    LogOut,
    Settings
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Blogs", href: "/admin/blogs", icon: FileText },
    { name: "Projects", href: "/admin/projects", icon: Briefcase },
    { name: "Experiments", href: "/admin/experiments", icon: Beaker },
    { name: "Certificates", href: "/admin/certificates", icon: FileText },
    { name: "Skills", href: "/admin/skills", icon: Layers }, // Using Layers for Skills
    { name: "Sections", href: "/admin/sections", icon: Layers },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Resume", href: "/admin/resume", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    return (
        <aside className="w-64 bg-black border-r border-white/10 h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">
                    <span className="text-white">Admin</span> Panel
                </h2>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                ? "bg-white/10 text-white border border-white/20"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
