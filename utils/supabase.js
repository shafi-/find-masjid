import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { SB_PASS, SB_URL } from './config.local';

let supabase = undefined;

/**
 * Get Supabase client instance
 *
 * @returns {SupabaseClient}
 */
export function getSupabaseInstance() {
    if (!supabase) {
        supabase = createClient(SB_URL, SB_PASS);
    }
    
    return supabase;
}
