export const dynamic = "force-dynamic";

"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Loader2, Plus, Pencil, Trash2, Upload, Calendar, Award } from "lucide-react";
import Image from "next/image";

interface Certificate {
    id: string;
    title: string;
    issuer: string;
    issue_date: string;
    credential_url: string;
    image_url: string;
}

export default function AdminCertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCert, setEditingCert] = useState<Certificate | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<Partial<Certificate>>({
        title: "",
        issuer: "",
        issue_date: "",
        credential_url: "",
        image_url: "",
    });

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        const { data, error } = await supabase
            .from("certificates")
            .select("*")
            .order("issue_date", { ascending: false });

        if (error) console.error("Error fetching certificates:", error);
        else setCertificates(data || []);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare data, ensuring empty strings are null for optional fields
            const dataToSave = {
                title: formData.title,
                issuer: formData.issuer,
                issue_date: formData.issue_date || new Date().toISOString().split('T')[0], // Default to today if empty
                credential_url: formData.credential_url || null,
                image_url: formData.image_url || null,
            };

            if (editingCert) {
                const { error } = await supabase
                    .from("certificates")
                    .update(dataToSave)
                    .eq("id", editingCert.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("certificates")
                    .insert([dataToSave]);
                if (error) throw error;
            }

            setIsModalOpen(false);
            setEditingCert(null);
            setFormData({
                title: "",
                issuer: "",
                issue_date: "",
                credential_url: "",
                image_url: "",
            });
            fetchCertificates();
        } catch (error: any) {
            console.error("Error saving certificate:", error);
            alert("Failed to save certificate: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this certificate?")) return;

        const { error } = await supabase.from("certificates").delete().eq("id", id);
        if (error) console.error("Error deleting certificate:", error);
        else fetchCertificates();
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `cert-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        setUploading(true);

        const { error: uploadError } = await supabase.storage
            .from('certificates')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            alert('Failed to upload image. Make sure the "certificates" bucket exists and is public.');
            setUploading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('certificates')
            .getPublicUrl(filePath);

        setFormData(prev => ({ ...prev, image_url: publicUrl }));
        setUploading(false);
    };

    const openEditModal = (cert: Certificate) => {
        setEditingCert(cert);
        setFormData(cert);
        setIsModalOpen(true);
    };

    const openNewModal = () => {
        setEditingCert(null);
        setFormData({
            title: "",
            issuer: "",
            issue_date: "",
            credential_url: "",
            image_url: "",
        });
        setIsModalOpen(true);
    };

    if (loading && certificates.length === 0) return <Loader2 className="animate-spin text-neon-cyan" />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Certificates</h1>
                    <p className="text-gray-400">Manage your certifications and awards.</p>
                </div>
                <button
                    onClick={openNewModal}
                    className="px-4 py-2 bg-neon-blue text-white font-bold rounded-lg hover:bg-neon-blue/80 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} /> Add Certificate
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((cert) => (
                    <Card key={cert.id} className="p-4 flex flex-col gap-4 group">
                        <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden border border-white/10">
                            {cert.image_url ? (
                                <Image
                                    src={cert.image_url}
                                    alt={cert.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-600">
                                    <Award size={48} />
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-bold line-clamp-1">{cert.title}</h3>
                            <p className="text-neon-cyan text-sm">{cert.issuer}</p>
                            <div className="flex items-center gap-2 text-gray-500 text-xs mt-2">
                                <Calendar size={14} />
                                {new Date(cert.issue_date).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                            <button
                                onClick={() => openEditModal(cert)}
                                className="p-2 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 transition-colors"
                            >
                                <Pencil size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(cert.id)}
                                className="p-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors"
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
                title={editingCert ? "Edit Certificate" : "Add Certificate"}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="flex justify-center mb-6">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-48 bg-white/5 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-neon-cyan/50 transition-colors relative overflow-hidden"
                        >
                            {formData.image_url ? (
                                <Image
                                    src={formData.image_url}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <>
                                    {uploading ? <Loader2 className="animate-spin mb-2" /> : <Upload className="mb-2" />}
                                    <span className="text-sm text-gray-400">Click to upload image</span>
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
                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-blue outline-none text-white"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Issuer</label>
                            <input
                                type="text"
                                value={formData.issuer}
                                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-blue outline-none text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Issue Date</label>
                            <input
                                type="date"
                                value={formData.issue_date}
                                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-blue outline-none text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Credential URL</label>
                        <input
                            type="url"
                            value={formData.credential_url}
                            onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-neon-blue outline-none text-white"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="w-full py-3 rounded-lg bg-neon-blue text-white font-bold hover:bg-neon-blue/80 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (editingCert ? "Update Certificate" : "Add Certificate")}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
