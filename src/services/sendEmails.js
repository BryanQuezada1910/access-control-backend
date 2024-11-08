import nodemailer from "nodemailer";
import path from "node:path";
import { renderTemplate } from "../utils/renderTemplate.js";

const __dirname = import.meta.dirname;

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
      await this.transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: email,
        subject,
        html,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async sendWelcomeEmail(to, name, lastName) {
    const template = path.join(__dirname, "../templates/welcome.html");
    const html = await renderTemplate(template, { name: name, lastName: lastName });
    const subject = "Bienvenido a YouAccess";

    await this.sendEmail(to, subject, html);
  }
}
