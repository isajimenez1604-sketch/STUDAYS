import { env } from "../config/env";
import { AppError } from "../exceptions/errors/app.error";

export class EmailService {
  assertConfigured(): void {
    if (!env.brevoApiKey || !env.brevoFromEmail) {
      throw AppError.emailServiceNotConfigured();
    }
  }

  async sendPasswordResetCode(email: string, code: string): Promise<void> {
    const apiKey = env.brevoApiKey;
    const fromEmail = env.brevoFromEmail;
    if (!apiKey || !fromEmail) {
      throw AppError.emailServiceNotConfigured();
    }

    let response: Response;
    try {
      response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: "STUDAYS",
            email: fromEmail,
          },
          to: [{ email }],
          subject: "Código para recuperar tu contraseña de STUDAYS",
          textContent: `Tu código de recuperación es ${code}. Expira en 10 minutos. Si no solicitaste este cambio, ignora este correo.`,
          htmlContent: `<p>Tu código de recuperación de STUDAYS es:</p><p style="font-size:28px;font-weight:bold;letter-spacing:6px">${code}</p><p>Expira en 10 minutos. Si no solicitaste este cambio, ignora este correo.</p>`,
        }),
      });
    } catch (error) {
      console.error("[EmailService.sendPasswordResetCode]", error);
      throw AppError.emailDeliveryFailed();
    }

    if (!response.ok) {
      console.error(
        "[EmailService.sendPasswordResetCode] Brevo returned",
        response.status
      );
      throw AppError.emailDeliveryFailed();
    }
  }
}
