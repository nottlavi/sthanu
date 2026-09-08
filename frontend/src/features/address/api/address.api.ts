import { apiClient } from "@/lib/api/client";
import { Address } from "@/types/address.types";

export async function fetchUserAddress(): Promise<Address> {
  const response = await apiClient.get("/address/get-address");
  return response.data;
}

export async function saveUserAddress(payload: Address) {
  const response = await apiClient.post("/address/set-address", payload);

  return response.data;
}

export async function reverseGeoCode(payload: {
  latitude: number | undefined;
  longitude: number | undefined;
}) {
  const response = await apiClient.post("/location/reverse-geocode", payload);

  return response.data;
}
