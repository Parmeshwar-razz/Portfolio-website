import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThreeBackground from "@/components/ThreeBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Parmeshwar Razz | Portfolio",
    description: "Full Stack Developer & Data Scientist",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${inter.className} bg-black text-white selection:bg-neon-cyan/30 selection:text-neon-cyan`}>
                <ThreeBackground />
                {children}
            </body>
        </html>
    );
}
