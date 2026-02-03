"use client";

import { Brain, Database, LineChart, Code2 } from "lucide-react";

export function About() {
    const features = [
        {
            icon: <Brain className="text-neon-cyan" size={32} />,
            title: "Machine Learning",
            description: "Developing predictive models and deep learning algorithms using PyTorch and TensorFlow."
        },
        {
            icon: <Database className="text-neon-blue" size={32} />,
            title: "Big Data Engineering",
            description: "Architecting scalable data pipelines and ETL processes with SQL, Spark, and Cloud services."
        },
        {
            icon: <LineChart className="text-purple-500" size={32} />,
            title: "Data Visualization",
            description: "Creating interactive dashboards and storytelling with data using Tableau, PowerBI, and D3.js."
        },
        {
            icon: <Code2 className="text-green-500" size={32} />,
            title: "Full Stack Integration",
            description: "Deploying ML models into production web applications using FastAPI, Flask, and Next.js."
        }
    ];

    return (
        <section id="about" className="py-20 bg-black relative">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-4 mb-16">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neon-cyan/50"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-center">
                        About <span className="text-neon-cyan">Me</span>
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neon-cyan/50"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div className="space-y-6 text-gray-300 leading-relaxed">
                        <p>
                            I am a Data Scientist driven by the power of data to solve real-world problems. With a strong foundation in mathematics and computer science, I specialize in uncovering hidden patterns and translating complex datasets into strategic insights.
                        </p>
                        <p>
                            My expertise spans the entire data lifecycle—from data collection and cleaning to advanced modeling and deployment. I am passionate about building AI-driven solutions that automate processes and enhance decision-making.
                        </p>
                        <p>
                            Beyond the algorithms, I believe in the importance of communication. I strive to bridge the gap between technical complexity and business value, ensuring that data products are not just accurate, but also impactful and user-friendly.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {features.map((feature, index) => (
                            <div key={index} className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-neon-cyan/30 transition-colors group">
                                <div className="mb-4 p-3 bg-black rounded-lg w-fit group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
