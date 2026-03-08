// Local Knowledge Base for RazzBot
// This ensures the bot can answer even if AI APIs are hit by quota limits.

export const portfolioData = {
    name: "Parmeshwar Razz",
    role: "Data Scientist & ML Engineer",
    skills: [
        "Machine Learning (PyTorch, TensorFlow)",
        "Big Data (SQL, Spark, ETL)",
        "Data Visualization (Tableau, Recharts, D3.js)",
        "Full Stack (Next.js, FastAPI, Supabase)"
    ],
    projects: [
        {
            name: "Dataset Explorer",
            description: "Interactive tool for visualizing Netflix, Titanic, and Iris datasets."
        },
        {
            name: "Portfolio Website",
            description: "Built with Next.js, Three.js (3D backgrounds), and Framer Motion."
        }
    ],
    contact: "You can reach out via the Contact section at the bottom of the page.",
    mission: "Solving real-world problems using data-driven AI solutions.",
    about: "Passionate about Machine Learning and turning complex data into actionable insights."
};

/**
 * A simple keyword-based matcher to provide "Smart Mock" responses.
 * Enhanced to handle Hindi keywords and more variations.
 */
export function getMockResponse(query: string): string | null {
    const q = query.toLowerCase();
    
    // Owner / Creator specific queries
    if (
        q.includes("owner") || 
        q.includes("creator") || 
        q.includes("master") || 
        q.includes("kisne banaya") || 
        q.includes("kiske liye") || 
        q.includes("kiska bot") ||
        q.includes("shatranj") || // just in case for 'Razz' variations
        q.includes("boss")
    ) {
        return `Main Parmeshwar Razz ka personal AI assistant hoon. Unhone hi mujhe design aur build kiya hai taaki main unke amazing kaam aur skills ke baare mein duniya ko bata saku. Parmeshwar ek visionery Data Scientist hain!`;
    }

    // Who is Parmeshwar / About him
    if (
        q.includes("parmeshwar") || 
        q.includes("who") || 
        q.includes("kaun") || 
        q.includes("about") || 
        q.includes("yourself") || 
        q.includes("kon") ||
        q.includes("btao") ||
        q.includes("tell me")
    ) {
        if (q.includes("skill") || q.includes("hunnar") || q.includes("kaam")) {
             return `Parmeshwar is proficient in: ${portfolioData.skills.join(", ")}. He specializes in Machine Learning and Big Data Engineering.`;
        }
        if (q.includes("project") || q.includes("kaam")) {
            return `Unho ne kaafi interesting projects banaye hain, jaise ki "Dataset Explorer" aur ye aesthetic Portfolio website. Aap menu mein Projects section dekh sakte hain!`;
        }
        return `I am RazzBot. Parmeshwar Razz ek ${portfolioData.role} hain jo ${portfolioData.mission} par kaam kar rahe hain. Unhe AI aur Data Science mein kaafi interest hai.`;
    }
    
    // Skills specific
    if (q.includes("skill") || q.includes("know") || q.includes("tech") || q.includes("language") || q.includes("ati hai")) {
        return `Parmeshwar ko ye sab aata hai: ${portfolioData.skills.join(", ")}. He is a pro in Python, SQL, and Full Stack development.`;
    }
    
    // Projects specific
    if (q.includes("project") || q.includes("work") || q.includes("kya banaya")) {
        return `He has developed powerful tools like the "${portfolioData.projects[0].name}" (visual analytics) and this Next.js Portfolio. Unka kaam kaafi niche-specific aur data-driven hota hai.`;
    }

    // Contact specific
    if (q.includes("contact") || q.includes("hire") || q.includes("email") || q.includes("phone") || q.includes("milna")) {
        return `Aap Parmeshwar se niche diye gaye "Contact" section se baat kar sakte hain. Wo collaboration ke liye hamesha ready rehte hain!`;
    }

    // Greetings
    if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("namaste")) {
        return "Hi there! I am RazzBot. Main Parmeshwar's ke skills, projects, aur experience ke baare mein sab bata sakta hoon. Aap kya jaanna chahenge?";
    }

    // Closing / Gratitude / Exit
    if (
        q === "ok" || 
        q === "okay" || 
        q === "thik hai" || 
        q === "theek hai" || 
        q === "nice" || 
        q === "cool" || 
        q.includes("thanks") || 
        q.includes("shukriya") || 
        q.includes("dhanyawad") || 
        q.includes("bye") || 
        q.includes("alvida") || 
        q.includes("good night") || 
        q.includes("chalo")
    ) {
        return "You're welcome! Agar aur kuch jaanna ho toh main yahi hoon. Have a great day! 😊";
    }

    return null; // Let the AI try if no keyword matches
}
