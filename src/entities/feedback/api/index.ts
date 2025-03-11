import { client } from "@/shared/lib/axios/client"
import { FEEDBACK_ENDPOINTS } from "./config"

// 피드백 생성 요청 (multipart/form-data)
interface CreateFeedbackRequest {
  files?: File[]
  title: string
  content: string
  type: "ERROR" | "PAYMENT" | "PARTNERSHIP" | "EVENT" | "ACCOUNT_INFO" | "CANCELLATION" | "OTHER"
  email: string
}

export const createFeedback = async (data: CreateFeedbackRequest): Promise<void> => {
  const formData = new FormData()
  formData.append("title", data.title)
  formData.append("content", data.content)
  formData.append("type", data.type)
  formData.append("email", data.email)
  if (data.files) {
    data.files.forEach((file) => formData.append("files", file))
  }
  const response = await client.post<void>(FEEDBACK_ENDPOINTS.postFeedback(), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}
