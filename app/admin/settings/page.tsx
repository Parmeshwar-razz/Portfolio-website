export const dynamic = "force-dynamic";

"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { Loader2, Upload, Save, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function SettingsPage() {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const { data, error } = await supabase
            .from("site_settings")
            .select("logo_url")
            .single();

        if (error) {
            // If no row exists, we might need to create one, but schema says we insert one initially
            console.error("Error fetching settings:", error);
        } else if (data) {
            setLogoUrl(data.logo_url);
        }
        setLoading(false);
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `logo-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        setUploading(true);

        // 1. Upload to Storage
        const { error: uploadError } = await supabase.storage
            .from('assets')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading logo:', uploadError);
            alert('Failed to upload logo');
            setUploading(false);
            return;
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('assets')
            .getPublicUrl(filePath);

        // 3. Update Database
        const { error: dbError } = await supabase
            .from('site_settings')
            .update({ logo_url: publicUrl })
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all rows (should be only one)
        // Note: A better way is to update the single row we know exists. 
        // Since we don't know the ID, we can fetch it first or just update where id is not null.
        // Actually, let's just update the first row found or use a known ID if we had one.
        // For now, let's fetch the ID first in fetchSettings or just update all rows since there's only 1.

        // Let's refine the update to be safer:
        // We need to find the ID of the settings row.
        const { data: settings } = await supabase.from('site_settings').select('id').limit(1).single();

        if (settings) {
            const { error: updateError } = await supabase
                .from('site_settings')
                .update({ logo_url: publicUrl })
                .eq('id', settings.id);

            if (updateError) {
                console.error('Error updating settings:', updateError);
                alert('Failed to save logo URL to database');
            } else {
                setLogoUrl(publicUrl);
            }
        } else {
            // Insert if not exists (should exist from migration)
            const { error: insertError } = await supabase
                .from('site_settings')
                .insert([{ logo_url: publicUrl }]);

            if (insertError) {
                console.error('Error inserting settings:', insertError);
            } else {
                setLogoUrl(publicUrl);
            }
        }

        setUploading(false);
    };

    const removeLogo = async () => {
        if (!confirm("Are you sure you want to remove the logo?")) return;

        setUploading(true);

        // We don't necessarily need to delete the file from storage, just clear the URL from DB.
        // But cleaning up storage is good.
        // For now, just clear DB to be safe.

        const { data: settings } = await supabase.from('site_settings').select('id').limit(1).single();

        if (settings) {
            const { error } = await supabase
                .from('site_settings')
                .update({ logo_url: null })
                .eq('id', settings.id);

            if (error) {
                console.error("Error removing logo:", error);
                alert("Failed to remove logo");
            } else {
                setLogoUrl(null);
            }
        }
        setUploading(false);
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-neon-cyan" /></div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Site Settings</h2>
                <p className="text-gray-400">Manage global website settings.</p>
            </div>

            <Card className="p-6 space-y-6">
                <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <ImageIcon size={20} className="text-neon-cyan" />
                        Website Logo
                    </h3>
                    <p className="text-gray-400 mb-4 text-sm">
                        Upload a logo to replace the default "PR." text in the navigation bar.
                        Recommended size: 100x100px or similar square/rectangular aspect ratio.
                    </p>

                    <div className="flex items-start gap-6">
                        <div className="w-32 h-32 bg-black/50 rounded-full border border-white/10 flex items-center justify-center overflow-hidden relative group">
                            {logoUrl ? (
                                <Image
                                    src={logoUrl}
                                    alt="Site Logo"
                                    width={128}
                                    height={128}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <span className="text-2xl font-bold text-gray-600">PR.</span>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="px-4 py-2 bg-neon-cyan text-black font-bold rounded-lg hover:bg-neon-cyan/80 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                                    Upload Logo
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleLogoUpload}
                                    accept="image/*"
                                    className="hidden"
                                />

                                {logoUrl && (
                                    <button
                                        onClick={removeLogo}
                                        disabled={uploading}
                                        className="px-4 py-2 bg-red-500/10 text-red-400 font-bold rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <Trash2 size={18} />
                                        Remove
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">
                                Supported formats: PNG, JPG, SVG, WEBP
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div >
    );
}
