// src/services/orderRequest.ts
import { supabase } from "../lib/supabaseClient";
import type { OrderRequestInsert } from "../types/order";

export async function createOrderRequest(payload: OrderRequestInsert) {
  const { error } = await supabase
    .from("order_request")
    .insert(payload);

  if (error) {
    throw error;
  }

  return true;
}
