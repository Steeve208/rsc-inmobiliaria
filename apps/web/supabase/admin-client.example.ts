/**
 * Copia este archivo a tu proyecto WEB ADMIN (otro repo).
 *
 * Instalación en el admin:
 *   npm install @supabase/supabase-js
 *
 * Variables de entorno (solo en el servidor del admin — NUNCA expongas service_role al navegador):
 *   NEXT_PUBLIC_SUPABASE_URL=https://TU_PROJECT.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...   (Dashboard → Settings → API → service_role)
 *
 * La publishable key (sb_publishable_...) sirve para lectura pública con RLS.
 * Para crear/editar/borrar desde el admin usa SIEMPRE service_role en Server Actions,
 * Route Handlers o backend del admin.
 */
import { createClient } from "@supabase/supabase-js";

export type Database = {
  public: {
    Tables: {
      property_listing: { Row: Record<string, unknown> };
      vehicle_listing: { Row: Record<string, unknown> };
      company: { Row: Record<string, unknown> };
      listing_image: { Row: Record<string, unknown> };
      scheduled_visit: { Row: Record<string, unknown> };
      chat_thread: { Row: Record<string, unknown> };
      chat_message: { Row: Record<string, unknown> };
      company_lead_config: { Row: Record<string, unknown> };
      user: { Row: Record<string, unknown> };
      favorite: { Row: Record<string, unknown> };
    };
  };
};

/** Cliente admin — solo usar en servidor (service_role bypassa RLS). */
export function createAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// --- Ejemplos de operaciones que el panel admin haría ---

export async function listAllProperties() {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("property_listing")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function publishProperty(id: string) {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("property_listing")
    .update({ status: "active", published_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createProperty(row: {
  id?: string;
  title: string;
  price: number;
  country: string;
  city: string;
  company_id?: string;
  status?: string;
  cover_image?: string;
}) {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("property_listing")
    .insert({
      id: row.id ?? `p_${Date.now()}`,
      title: row.title,
      price: row.price,
      country: row.country,
      city: row.city,
      company_id: row.company_id,
      status: row.status ?? "draft",
      cover_image: row.cover_image,
      currency: "BRL",
      type: "house",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function verifyCompany(companyId: string) {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("company")
    .update({ verified: true })
    .eq("id", companyId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listPendingVisits() {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("scheduled_visit")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function confirmVisit(visitId: string) {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("scheduled_visit")
    .update({ status: "confirmed" })
    .eq("id", visitId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
