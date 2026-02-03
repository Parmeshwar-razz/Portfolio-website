"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Loader2, Upload, FileText, Trash2, Download } from "lucide-react";

export default function ResumePage() {
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResume();
    }, []);

    const fetchResume = async () => {
        const { data } = await supabase
            .from("site_settings")
            .select("resume_url")
            .single();

        if (data?.resume_url) {
            setResumeUrl(data.resume_url);
        }
        setLoading(false);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `resume-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // 1. Upload to Storage
        const { error: uploadError } = await supabase.storage
            .from('resumes')
            .upload(filePath, file);

        if (uploadError) {
            alert("Error uploading file: " + uploadError.message);
            setUploading(false);
            return;
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('resumes')
            .getPublicUrl(filePath);

        // 3. Update Database
        const { error: dbError } = await supabase
            .from("site_settings")
            .update({ resume_url: publicUrl })
            .eq("id", 1); // Assuming single row for settings

        // If no row exists, insert one
        if (dbError) {
            await supabase.from("site_settings").insert([{ id: 1, resume_url: publicUrl }]);
        }

        setResumeUrl(publicUrl);
        setUploading(false);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete the resume?")) return;

        await supabase
            .from("site_settings")
            .update({ resume_url: null })
            .eq("id", 1);

        setResumeUrl(null);
    };

    if (loading) return <Loader2 className="animate-spin mx-auto mt-20" />;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Resume Management</h1>

            <Card className="p-8 max-w-xl bg-white/5 border-white/10">
                <div className="flex flex-col items-center justify-center gap-6 text-center">
                    <div className="p-4 bg-neon-cyan/10 rounded-full text-neon-cyan">
                        <FileText size={48} />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">Current Resume</h3>
                        {resumeUrl ? (
                            <div className="flex items-center gap-2 justify-center">
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-neon-cyan hover:underline flex items-center gap-1"
                                >
                                    View Current Resume <Download size={14} />
                                </a>
                            </div>
                        ) : (
                            <p className="text-gray-500">No resume uploaded yet.</p>
                        )}
                    </div>

                    <div className="flex gap-4 w-full">
                        <div className="relative flex-1">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={uploading}
                            />
                            <Button className="w-full" isLoading={uploading} icon={<Upload size={18} />}>
                                {uploading ? "Uploading..." : "Upload New Resume"}
                            </Button>
                        </div>
                        {resumeUrl && (
                            <Button variant="outline" onClick={handleDelete} className="text-red-400 border-red-400/30 hover:bg-red-400/10">
                                <Trash2 size={18} />
                            </Button>
                        )}
                    </div>
                    <p className="text-xs text-gray-500">Supported formats: PDF only. Max size: 5MB.</p>
                </div>
            </Card>
        </div>
    );
}
