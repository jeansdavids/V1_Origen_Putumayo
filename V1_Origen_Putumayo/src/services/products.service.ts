/**
 * Servicios públicos de productos.
 * Autor: Kaleth
 */

import { supabase } from "../lib/supabaseClient";

export const getPublicProducts = async () => {
  const { data, error } = await supabase
    .from("products_public")
    .select("*");

  if (error) throw error;
  return data ?? [];
};
