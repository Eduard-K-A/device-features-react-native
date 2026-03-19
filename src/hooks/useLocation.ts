import * as Location from "expo-location";
import { useCallback, useState } from "react";
import type { Coordinates } from "../types/entry";

export interface UseLocationState {
  isLoading: boolean;
  error: string | null;
  coords: Coordinates | null;
  getCurrentLocation: () => Promise<Coordinates | null>;
  reset: () => void;
}

export function useLocation(): UseLocationState {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<Coordinates | null>(null);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setCoords(null);
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<Coordinates | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const next: Coordinates = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
      setCoords(next);
      return next;
    } catch (e) {
      setError("Unable to fetch current location.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, coords, getCurrentLocation, reset };
}

