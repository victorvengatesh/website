export type CheckoutPaymentMethod = "card" | "upi" | "cod";

export type PaymentSession = {
  clientSecret: string;
  provider: "stripe";
};

/**
 * Payment boundary for the checkout UI. Replace this implementation with a
 * server-side route that creates a Stripe PaymentIntent. Secret keys must
 * never be exposed through NEXT_PUBLIC_* variables.
 */
export const paymentService = {
  async createSession(): Promise<PaymentSession> {
    throw new Error("Connect a server-side Stripe PaymentIntent route before enabling live card payments.");
  },
};
