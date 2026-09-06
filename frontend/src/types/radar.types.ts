export type RadarRange = 10 | 30 | 60;

export interface getRawReq {
  latitude: number;
  longitude: number;
  distance?: RadarRange | null;
}
