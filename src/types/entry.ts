export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface TravelEntry {
  id: string;
  imageUri: string;
  address: string;
  coords: Coordinates | null;
  createdAt: number;
}

