import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

interface MailOptions {
    to: string;
    subject: string;
    html: string;
}

const sendEmail = async ({ to, subject, html }: MailOptions) => {
    await resend.emails.send({
        from: "Greatness <onboarding@resend.dev>",
        to,
        subject,
        html,
    });
};

export default sendEmail;