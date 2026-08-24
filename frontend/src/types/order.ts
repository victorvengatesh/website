export type OrderStatus =
  | "pending_confirmation"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "rejected"
  | "cancelled";

export type OrderItem = {
  id?: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  unit_price: string | number;
  line_total: string | number;
};

export type Order = {
  id: string;
  status: OrderStatus;
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  pincode: string;
  latitude?: number | null;
  longitude?: number | null;
  distance_km?: number | null;
  subtotal: string | number;
  delivery_fee: string | number;
  total: string | number;
  eta_text?: string | null;
  admin_note?: string | null;
  created_at: string;
  updated_at?: string;
  items: OrderItem[];
};
