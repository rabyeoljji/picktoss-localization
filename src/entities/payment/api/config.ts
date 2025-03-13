import { createKey as originalCreateKey } from "@/shared/api/lib/create-key"

const PAYMENT = "payment"

export const PAYMENT_ENDPOINTS = {
  verifyPayment: () => "/payments/verify",
  createPayments: () => "/payments/save",
  cancelPayments: () => "/payments/cancel",
}

export const PAYMENT_KEYS = {
  verifyPayment: originalCreateKey(PAYMENT, PAYMENT_ENDPOINTS.verifyPayment()),
  createPayments: originalCreateKey(PAYMENT, PAYMENT_ENDPOINTS.createPayments()),
  cancelPayments: originalCreateKey(PAYMENT, PAYMENT_ENDPOINTS.cancelPayments()),
}
