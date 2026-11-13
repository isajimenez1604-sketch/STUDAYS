import { supabase } from "../config/supabase";
import { AppError } from "../exceptions/errors/app.error";

const RESET_CODES_TABLE = "password_reset_codes";

export interface PasswordResetCode {
  id: number;
  user_id: number;
  code_hash: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

export class PasswordResetRepository {
  async replaceForUser(
    userId: number,
    codeHash: string,
    expiresAt: string
  ): Promise<void> {
    const { error: deleteError } = await supabase
      .from(RESET_CODES_TABLE)
      .delete()
      .eq("user_id", userId)
      .is("used_at", null);

    if (deleteError) {
      console.error("[PasswordResetRepository.replaceForUser.delete]", deleteError);
      throw AppError.database();
    }

    const { error } = await supabase.from(RESET_CODES_TABLE).insert({
      user_id: userId,
      code_hash: codeHash,
      expires_at: expiresAt,
    });

    if (error) {
      console.error("[PasswordResetRepository.replaceForUser.insert]", error);
      throw AppError.database();
    }
  }

  async findLatestActive(userId: number): Promise<PasswordResetCode | null> {
    const { data, error } = await supabase
      .from(RESET_CODES_TABLE)
      .select("id, user_id, code_hash, expires_at, used_at, created_at")
      .eq("user_id", userId)
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[PasswordResetRepository.findLatestActive]", error);
      throw AppError.database();
    }

    return data as PasswordResetCode | null;
  }

  async deleteForUser(userId: number): Promise<void> {
    const { error } = await supabase
      .from(RESET_CODES_TABLE)
      .delete()
      .eq("user_id", userId)
      .is("used_at", null);

    if (error) {
      console.error("[PasswordResetRepository.deleteForUser]", error);
      throw AppError.database();
    }
  }

  async consumeAndUpdatePassword(
    userId: number,
    codeHash: string,
    passwordHash: string
  ): Promise<boolean> {
    const { data, error } = await supabase.rpc("consume_password_reset", {
      p_user_id: userId,
      p_code_hash: codeHash,
      p_password_hash: passwordHash,
    });

    if (error) {
      console.error(
        "[PasswordResetRepository.consumeAndUpdatePassword]",
        error
      );
      throw AppError.database();
    }

    return data === true;
  }
}
