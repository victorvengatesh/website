import { apiRequest } from "@/services/api";

export type OrderPayload = {
  recipient_name: string;
  phone: string;
  address_line: string;
  city: string;
  pincode: string;
  latitude: number;
  longitude: number;
  items: Array<{ sku: string; quantity: number }>;
};

export type OrderResponse = {
  id: string;
  status: string;
  total: string | number;
  eta_text?: string | null;
};

export const orderService = {
  create(payload: OrderPayload) {
    return apiRequest<OrderResponse>("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  get(orderId: string) {
    return apiRequest<OrderResponse>(`/orders/${orderId}`);
  },
};
