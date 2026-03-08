import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getMockResponse } from "@/lib/bot-knowledge";

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();
        
        const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;

        // 1. Smart "Mock" Fallback - Fast and No API Call
        // This answers common queries like "Who are you?" instantly.
        const mockResponse = getMockResponse(message);
        if (mockResponse) {
            console.log("Using Mock Response for:", message);
            return NextResponse.json({ text: mockResponse });
        }

        const SYSTEM_PROMPT = `
        You are "RazzBot", an AI assistant for Parmeshwar Razz's portfolio website. 
        Your goal is to provide detailed information about Parmeshwar Razz to visitors.

        ### About Parmeshwar Razz:
        - **Role**: Data Scientist & ML Engineer.
        - **Mission**: Driven by the power of data to solve real-world problems. Specializes in uncovering hidden patterns and translating complex datasets into strategic insights.
        - **Passions**: AI-driven solutions, automation, and bridging the gap between technical complexity and business value.

        ### Technical Skills:
        - **Machine Learning**: Predictive models, deep learning, PyTorch, TensorFlow.
        - **Big Data Engineering**: Scalable data pipelines, ETL, SQL, Spark, Cloud services.
        - **Data Visualization**: Interactive dashboards, Tableau, PowerBI, D3.js.
        - **Full Stack Integration**: Deploying ML models with FastAPI, Flask, and Next.js.
        - **Frontend**: React, Next.js, Tailwind CSS, Framer Motion, Three.js (for 3D backgrounds).

        ### Projects & Experience:
        - **Dataset Explorer**: An interactive tool on this portfolio allowing users to visualize Netflix, Titanic, and Iris datasets with live charts and filters.
        - **Portfolio Website**: Built with Next.js 14, Supabase (for CMS), and Three.js for immersive 3D metaball backgrounds.
        - **Data Science Lab**: A dedicated section for advanced analytics and experiments.

        ### Personality & Tone:
        - **Professional but Friendly**: Treat users like collaborators or potential employers.
        - **Direct & Concise**: Answer questions efficiently.
        - **Proud but Humble**: Showcase achievements without being arrogant.
        - **Language**: Respond in the language the user uses (Hindi or English).
        `;

        // 2. Try OpenAI if key is present
        if (openaiKey && openaiKey.trim()) {
            try {
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${openaiKey.trim()}`
                    },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [
                            { role: "system", content: SYSTEM_PROMPT },
                            ...(history || []).map((h: any) => ({ 
                                role: h.role === "user" ? "user" : "assistant", 
                                content: h.content 
                            })),
                            { role: "user", content: message }
                        ]
                    })
                });

                const data = await response.json();
                
                if (data.choices?.[0]?.message?.content) {
                    return NextResponse.json({ text: data.choices[0].message.content });
                }
                
                if (data.error && data.error.code === 'insufficient_quota') {
                    console.warn("OpenAI Quota Exceeded. Trying Gemini...");
                }
            } catch (e: any) {
                console.error("OpenAI error:", e.message);
            }
        }

        // 3. Fallback to Gemini (Free)
        if (geminiKey && geminiKey.trim()) {
            const genAI = new GoogleGenerativeAI(geminiKey.trim());
            const models = ["gemini-1.5-flash", "gemini-1.5-pro"];
            
            for (const modelId of models) {
                try {
                    const model = genAI.getGenerativeModel({ model: modelId });
                    const fullPrompt = `${SYSTEM_PROMPT}\n\nHistory:\n${(history || []).map((h:any) => `${h.role}: ${h.content}`).join("\n")}\n\nUser: ${message}`;
                    const result = await model.generateContent(fullPrompt);
                    const text = (await result.response).text();
                    if (text) return NextResponse.json({ text });
                } catch (e: any) {
                    console.warn(`Gemini ${modelId} failed:`, e.message);
                }
            }
        }

        // 4. Final Fallback - If everything fails, give a polite error-proof mock
        return NextResponse.json({ 
            text: "Main abhi thoda busy hoon (AI server limit reached), lekin main Parmeshwar ke baare mein sab jaanta hoon. Aap unke projects ya skills ke baare mein pooch sakte hain!\n\n(Note: AI is currently in offline mode)." 
        });

    } catch (error: any) {
        console.error("Server-side Chat Error:", error);
        return NextResponse.json({ 
            text: "Sorry, I am having a bit of trouble connecting to my brain right now. Please try again in 1 minute!" 
        });
    }
}
