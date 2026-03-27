// @db/integrations.ts
import { supabase } from "@config/supabase.config"; // your drizzle or pg client
// import { integrations } from "@config/supabase.config"; // drizzle schema

export async function getIntegrationToken(userId: string, service: string) {
    console.log("getIntegrationToken", userId, service)
    const record = await supabase
        .from("user_integrations")
        .select("*")
        .eq("user_id", userId)
        .eq("service", service)
        .limit(1)
        .single()

    console.log("getIntegrationToken record: ", record)
    if (!record) throw new Error("Integration not found");
    return {
        encryptedToken: record.data.encrypted_token,
        iv: record.data.iv,
        tag: record.data.auth_tag,
    };
}
