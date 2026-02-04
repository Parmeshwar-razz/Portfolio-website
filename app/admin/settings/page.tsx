"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { Loader2, Upload, Save, Trash2, Image as ImageIcon, User } from "lucide-react";
import Image from "next/image";

export default function SettingsPage() {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadingHero, setUploadingHero] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const heroInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const { data, error } = await supabase
            .from("site_settings")
            .select("logo_url, hero_image_url")
            .single();

        if (error) {
            console.error("Error fetching settings:", error);
        } else if (data) {
            setLogoUrl(data.logo_url);
            setHeroImageUrl(data.hero_image_url);
        }
        setLoading(false);
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        await handleUpload(file, 'logo');
    };

    const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        await handleUpload(file, 'hero');
    };

    const handleUpload = async (file: File, type: 'logo' | 'hero') => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${type}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const setUploadState = type === 'logo' ? setUploading : setUploadingHero;
        setUploadState(true);

        // 1. Upload to Storage
        const { error: uploadError } = await supabase.storage
            .from('assets')
            .upload(filePath, file);

        if (uploadError) {
            console.error(`Error uploading ${type}:`, uploadError);
            alert(`Failed to upload ${type}`);
            setUploadState(false);
            return;
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('assets')
            .getPublicUrl(filePath);

        // 3. Update Database
        const updateField = type === 'logo' ? { logo_url: publicUrl } : { hero_image_url: publicUrl };

        // Find ID first since we need a where clause
        const { data: settings } = await supabase.from('site_settings').select('id').limit(1).single();

        if (settings) {
            const { error: updateError } = await supabase
                .from('site_settings')
                .update(updateField)
                .eq('id', settings.id);

            if (updateError) {
                console.error('Error updating settings:', updateError);
                alert('Failed to save URL to database');
            } else {
                if (type === 'logo') setLogoUrl(publicUrl);
                else setHeroImageUrl(publicUrl);
            }
        } else {
            // Insert if not exists
            const { error: insertError } = await supabase
                .from('site_settings')
                .insert([updateField]);

            if (insertError) {
                console.error('Error inserting settings:', insertError);
            } else {
                if (type === 'logo') setLogoUrl(publicUrl);
                else setHeroImageUrl(publicUrl);
            }
        }
        setUploadState(false);
    }

    const removeImage = async (type: 'logo' | 'hero') => {
        if (!confirm(`Are you sure you want to remove the ${type}?`)) return;

        const setUploadState = type === 'logo' ? setUploading : setUploadingHero;
        setUploadState(true);

        const { data: settings } = await supabase.from('site_settings').select('id').limit(1).single();

        if (settings) {
            const updateField = type === 'logo' ? { logo_url: null } : { hero_image_url: null };

            const { error } = await supabase
                .from('site_settings')
                .update(updateField)
                .eq('id', settings.id);

            if (error) {
                console.error(`Error removing ${type}:`, error);
                alert(`Failed to remove ${type}`);
            } else {
                if (type === 'logo') setLogoUrl(null);
                else setHeroImageUrl(null);
            }
        }
        setUploadState(false);
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-neon-cyan" /></div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Site Settings</h2>
                <p className="text-gray-400">Manage global website settings.</p>
            </div>

            <Card className="p-6 space-y-6">
                {/* Logo Section */}
                <div className="border-b border-white/10 pb-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <ImageIcon size={20} className="text-neon-cyan" />
                        Website Logo
                    </h3>
                    <p className="text-gray-400 mb-4 text-sm">
                        Upload a logo to replace the default "PR." text.
                    </p>

                    <div className="flex items-start gap-6">
                        <div className="w-32 h-32 bg-black/50 rounded-full border border-white/10 flex items-center justify-center overflow-hidden relative">
                            {logoUrl ? (
                                <Image src={logoUrl} alt="Logo" width={128} height={128} className="object-cover w-full h-full" />
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
                                <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />

                                {logoUrl && (
                                    <button onClick={() => removeImage('logo')} disabled={uploading} className="px-4 py-2 bg-red-500/10 text-red-400 font-bold rounded-lg hover:bg-red-500/20 flex items-center gap-2">
                                        <Trash2 size={18} /> Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Image Section */}
                <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <User size={20} className="text-neon-cyan" />
                        Hero Image
                    </h3>
                    <p className="text-gray-400 mb-4 text-sm">
                        Upload a photo for the Hero section (replaces the 3D placeholder).
                    </p>

                    <div className="flex items-start gap-6">
                        <div className="w-32 h-32 bg-black/50 rounded-full border border-white/10 flex items-center justify-center overflow-hidden relative">
                            {heroImageUrl ? (
                                <Image src={heroImageUrl} alt="Hero" width={128} height={128} className="object-cover w-full h-full" />
                            ) : (
                                <User className="text-gray-600" size={40} />
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => heroInputRef.current?.click()}
                                    disabled={uploadingHero}
                                    className="px-4 py-2 bg-neon-cyan text-black font-bold rounded-lg hover:bg-neon-cyan/80 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {uploadingHero ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                                    Upload Photo
                                </button>
                                <input type="file" ref={heroInputRef} onChange={handleHeroImageUpload} accept="image/*" className="hidden" />

                                {heroImageUrl && (
                                    <button onClick={() => removeImage('hero')} disabled={uploadingHero} className="px-4 py-2 bg-red-500/10 text-red-400 font-bold rounded-lg hover:bg-red-500/20 flex items-center gap-2">
                                        <Trash2 size={18} /> Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
