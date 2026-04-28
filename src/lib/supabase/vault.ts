import "server-only";
import { createServiceRoleClient } from "./service-role";

export async function vaultCreateSecret(
  name: string,
  value: string,
  description = "",
): Promise<string> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.rpc("urpe_vault_create_secret", {
    secret_value: value,
    secret_name: name,
    secret_description: description,
  });
  if (error) throw new Error(`vault create failed: ${error.message}`);
  if (!data) throw new Error("vault create returned no id");
  return data as string;
}

export async function vaultReadSecret(secretId: string): Promise<string> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.rpc("urpe_vault_read_secret", {
    secret_id: secretId,
  });
  if (error) throw new Error(`vault read failed: ${error.message}`);
  if (data == null) throw new Error("vault secret not found");
  return data as string;
}

export async function vaultUpdateSecret(
  secretId: string,
  newValue: string,
): Promise<void> {
  const supabase = createServiceRoleClient();
  const { error } = await supabase.rpc("urpe_vault_update_secret", {
    secret_id: secretId,
    new_value: newValue,
  });
  if (error) throw new Error(`vault update failed: ${error.message}`);
}
