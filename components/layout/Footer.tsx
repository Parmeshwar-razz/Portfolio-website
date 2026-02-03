import { Github, Linkedin, Twitter, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold font-mono mb-2">PR<span className="text-neon-cyan">.</span></h3>
                        <p className="text-gray-400 text-sm">
                            Building digital experiences with code and creativity.
                        </p>
                    </div>

                    <div className="flex gap-6">
                        <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors">
                            <Github size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors">
                            <Linkedin size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors">
                            <Twitter size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-neon-cyan transition-colors">
                            <Mail size={20} />
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 text-center text-xs text-gray-500">
                    © {new Date().getFullYear()} Parmeshwar Razz. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
