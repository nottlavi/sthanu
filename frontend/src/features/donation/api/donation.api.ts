import { apiClient } from "@/lib/api/client";

export async function uploadCert(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await apiClient.post("/donation/log", formData, {
    headers: {
      "Content-Type": undefined,
    },
  });
  return response.data;
}
