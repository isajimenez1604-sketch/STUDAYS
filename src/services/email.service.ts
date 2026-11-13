import { env } from "../config/env";
import { AppError } from "../exceptions/errors/app.error";

export class EmailService {
  assertConfigured(): void {
    if (!env.resendApiKey || !env.resendFromEmail) {
      throw AppError.emailServiceNotConfigured();
    }
  }

  async sendPasswordResetCode(email: string, code: string): Promise<void> {
    this.assertConfigured();

    let response: Response;
    try {
      response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: env.resendFromEmail,
          to: [email],
          subject: "Código para recuperar tu contraseña de STUDAYS",
          text: `Tu código de recuperación es ${code}. Expira en 10 minutos. Si no solicitaste este cambio, ignora este correo.`,
          html: `<p>Tu código de recuperación de STUDAYS es:</p><p style="font-size:28px;font-weight:bold;letter-spacing:6px">${code}</p><p>Expira en 10 minutos. Si no solicitaste este cambio, ignora este correo.</p>`,
        }),
      });
    } catch (error) {
      console.error("[EmailService.sendPasswordResetCode]", error);
      throw AppError.emailDeliveryFailed();
    }

    if (!response.ok) {
      console.error(
        "[EmailService.sendPasswordResetCode] Resend returned",
        response.status
      );
      throw AppError.emailDeliveryFailed();
    }
  }
}
