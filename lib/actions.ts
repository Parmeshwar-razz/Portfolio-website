"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
    name: string;
    email: string;
    message: string;
}

export async function sendEmail(data: EmailData) {
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is not set in environment variables.");
        return { error: "Email service not configured." };
    }

    try {
        const { name, email, message } = data;
        
        const response = await resend.emails.send({
            from: 'Portfolio <onboarding@resend.dev>',
            to: 'abhishekrazz622198@gmail.com',
            subject: `New Message from ${name} via Portfolio`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${message}</p>
            `,
            replyTo: email,
        });

        if (response.error) {
            console.error("Resend API Error:", response.error);
            return { error: response.error.message };
        }

        return { success: true };
    } catch (error: any) {
        console.error("Failed to send email:", error);
        return { error: error.message || "An unexpected error occurred." };
    }
}
