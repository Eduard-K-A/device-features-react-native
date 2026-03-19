import * as Location from "expo-location";
import { useCameraPermissions } from "expo-camera";
import { useCallback, useEffect, useMemo, useState } from "react";

export type PermissionKind = "camera" | "location";

export interface PermissionSnapshot {
  granted: boolean;
  canAskAgain: boolean;
  status: "granted" | "denied" | "undetermined";
}

function toSnapshot(
  granted: boolean,
  canAskAgain: boolean,
  status: "granted" | "denied" | "undetermined"
): PermissionSnapshot {
  return { granted, canAskAgain, status };
}

function toSimpleStatus(
  status: Location.PermissionStatus
): "granted" | "denied" | "undetermined" {
  if (status === "granted") return "granted";
  if (status === "denied") return "denied";
  return "undetermined";
}

export function usePermissions() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [locationPerm, setLocationPerm] = useState<PermissionSnapshot>(
    toSnapshot(false, true, "undetermined")
  );

  const camera = useMemo<PermissionSnapshot>(() => {
    const granted = cameraPermission?.granted ?? false;
    const canAskAgain = cameraPermission?.canAskAgain ?? true;
    const status = cameraPermission?.status ?? "undetermined";
    return toSnapshot(granted, canAskAgain, status);
  }, [cameraPermission]);

  const requestCamera = useCallback(async (): Promise<PermissionSnapshot> => {
    const res = await requestCameraPermission();
    return toSnapshot(res.granted, res.canAskAgain ?? true, res.status ?? "undetermined");
  }, [requestCameraPermission]);

  const refreshLocation = useCallback(async (): Promise<PermissionSnapshot> => {
    const current = await Location.getForegroundPermissionsAsync();
    const snap = toSnapshot(
      current.granted,
      current.canAskAgain ?? true,
      toSimpleStatus(current.status)
    );
    setLocationPerm(snap);
    return snap;
  }, []);

  const requestLocation = useCallback(async (): Promise<PermissionSnapshot> => {
    const res = await Location.requestForegroundPermissionsAsync();
    const snap = toSnapshot(res.granted, res.canAskAgain ?? true, toSimpleStatus(res.status));
    setLocationPerm(snap);
    return snap;
  }, []);

  useEffect(() => {
    void refreshLocation();
  }, [refreshLocation]);

  return {
    camera,
    requestCamera,
    location: locationPerm,
    requestLocation,
    refreshLocation,
  };
}

