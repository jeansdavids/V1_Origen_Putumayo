
export type DocumentType = "CC" | "TI" | "CE" | "PASAPORTE";
export type ItemType = "normal" | "encargo";

export interface CustomerSnapshot {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  document_type: DocumentType;
  document_id: string;
  references?: string;
  notes?: string;
}

export interface OrderItemSnapshot {
  product_id: string;
  product_name: string;
  company_name: string;
  quantity: number;
  item_type: ItemType;
}

export interface OrderRequestInsert {
  customer: CustomerSnapshot;
  items_json: OrderItemSnapshot[];
  internal_notes?: string | null;
}
