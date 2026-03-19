import * as Location from "expo-location";
import type { Coordinates } from "../types/entry";

function formatReverseGeocode(
  result: Location.LocationGeocodedAddress
): string {
  const parts = [
    result.name,
    result.street,
    result.city,
    result.region,
    result.postalCode,
    result.country,
  ].filter((p): p is string => typeof p === "string" && p.trim().length > 0);

  return parts.join(", ");
}

export async function reverseGeocodeAddress(
  coords: Coordinates
): Promise<string> {
  const results = await Location.reverseGeocodeAsync({
    latitude: coords.latitude,
    longitude: coords.longitude,
  });

  if (!results || results.length === 0) return "Address unavailable";
  const formatted = formatReverseGeocode(results[0]);
  return formatted.trim().length > 0 ? formatted : "Address unavailable";
}

