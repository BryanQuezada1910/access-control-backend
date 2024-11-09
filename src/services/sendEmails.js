import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import { renderTemplate } from "../utils/templates.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(email, subject, html) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: email,
        subject,
        html,
      });
      console.log(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  async sendWelcomeEmail(to, name, lastName) {
    try {
      const template = path.join(__dirname, "../templates/emails/welcome.html");
      const html = await renderTemplate(template, { name, lastName });
      const subject = "Bienvenido a YouAccess";
      await this.sendEmail(to, subject, html);
    } catch (error) {
      console.error("Error rendering or sending welcome email:", error);
    }
  }
}
