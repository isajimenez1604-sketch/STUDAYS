import "dotenv/config";

function requiredSupabaseUrl(): string {
  const value = process.env.SUPABASE_URL;
  if (!value) throw new Error("Falta la variable de entorno SUPABASE_URL");
  return value;
}

function requiredSupabaseServiceKey(): string {
  const value = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value) {
    throw new Error("Falta la variable de entorno SUPABASE_SERVICE_ROLE_KEY");
  }
  return value;
}

function requiredSessionSecret(): string {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error(
      "SESSION_SECRET es obligatoria y debe tener al menos 32 caracteres"
    );
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 3000),
  supabaseUrl: requiredSupabaseUrl(),
  supabaseServiceKey: requiredSupabaseServiceKey(),
  sessionSecret: requiredSessionSecret(),
  resendApiKey: process.env.RESEND_API_KEY?.trim() || null,
  resendFromEmail: process.env.RESEND_FROM_EMAIL?.trim() || null,
};
