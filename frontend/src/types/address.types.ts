export interface Address {
  addressLine: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;

  latitude: number;
  longitude: number;
}

export interface Location {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}
