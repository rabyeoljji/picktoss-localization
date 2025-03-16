import { client } from '@/shared/lib/axios/client'

import { PAYMENT_ENDPOINTS } from './config'

// 결제 정보 검증
interface VerifyPaymentRequest {
  impUid: string
  amount: number
}

interface IamportResponsePayment {
  code: number
  message: string
  response: Payment
}

interface Payment {
  channel: string
  escrow: boolean
  name: string
  amount: number
  currency: string
  status: string
  applyNum: string
  bankCode: string
  bankName: string
  cardCode: string
  cardName: string
  cardType: number
  vbankCode: string
  vbankName: string
  vbankNum: string
  vbankHolder: string
  vbankDate: string
  vbankIssuedAt: number
  cancelAmount: number
  startedAt: number
  paidAt: string
  failedAt: string
  cancelledAt: string
  failReason: string
  cancelReason: string
  receiptUrl: string
  cancelHistory: PaymentCancelDetail[]
  cashReceiptIssued: boolean
  customerUidUsage: string
  payMethod: string
  pgProvider: string
  embPgProvider: string
  pgTid: string
  impUid: string
  merchantUid: string
  buyerName: string
  buyerEmail: string
  buyerTel: string
  buyerAddr: string
  buyerPostcode: string
  customData: string
  customerUid: string
  cardQuota: number
  cardNumber: string
}

interface PaymentCancelDetail {
  amount: number
  reason: string
  cancelledAt: number
  receiptUrl: string
  pgTid: string
}

export const verifyPayment = async ({ data }: { data: VerifyPaymentRequest }): Promise<IamportResponsePayment> => {
  const response = await client.post<IamportResponsePayment>(PAYMENT_ENDPOINTS.verifyPayment(), data)
  return response.data
}

// 결제 정보 저장
interface CreatePaymentsRequest {
  impUid: string
  amount: number
}

export const createPayments = async ({ data }: { data: CreatePaymentsRequest }): Promise<void> => {
  const response = await client.post<void>(PAYMENT_ENDPOINTS.createPayments(), data)
  return response.data
}

// 결제 취소
export const cancelPayments = async (): Promise<void> => {
  const response = await client.post<void>(PAYMENT_ENDPOINTS.cancelPayments())
  return response.data
}
