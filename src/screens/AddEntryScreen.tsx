import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView } from "expo-camera";
import { useFocusEffect } from "@react-navigation/native";
import { ScreenGradient } from "../components/ScreenGradient";
import { GlassCard } from "../components/GlassCard";
import { GlassButton } from "../components/GlassButton";
import { FadeInSlideUp } from "../components/FadeInSlideUp";
import { PermissionPanel } from "../components/PermissionPanel";
import { LoadingInline } from "../components/LoadingInline";
import { useTheme } from "../context/useTheme";
import { useEntries } from "../context/useEntries";
import type { RootStackParamList } from "../types/navigation";
import { SPACING, RADIUS } from "../constants/spacing";
import { usePermissions } from "../hooks/usePermissions";
import { useCamera } from "../hooks/useCamera";
import { useLocation } from "../hooks/useLocation";
import { reverseGeocodeAddress } from "../utils/geocoding";
import { scheduleEntrySavedNotification } from "../hooks/useNotification";
import type { Coordinates } from "../types/entry";

type Props = NativeStackScreenProps<RootStackParamList, "AddEntry">;

type Stage = "camera" | "preview";

export function AddEntryScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { addEntry } = useEntries();

  const {
    camera,
    requestCamera,
    location,
    requestLocation,
    refreshLocation,
  } = usePermissions();
  const { cameraRef, isCapturing, error: cameraError, takePhoto, reset: resetCamera } =
    useCamera();
  const { isLoading: isLocating, error: locationError, getCurrentLocation, reset: resetLoc } =
    useLocation();

  const [stage, setStage] = useState<Stage>("camera");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [confirmedUri, setConfirmedUri] = useState<string | null>(null);
  const [address, setAddress] = useState<string>("");
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [entryCoords, setEntryCoords] = useState<Coordinates | null>(null);

  const resetAll = useCallback(() => {
    setStage("camera");
    setPhotoUri(null);
    setConfirmedUri(null);
    setAddress("");
    setIsGeocoding(false);
    setGeocodeError(null);
    setIsSaving(false);
    setEntryCoords(null);
    resetCamera();
    resetLoc();
  }, [resetCamera, resetLoc]);

  useFocusEffect(
    useCallback(() => {
      resetAll();
      return () => resetAll();
    }, [resetAll])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add Entry",
    });
  }, [navigation]);

  useEffect(() => {
    // Lightly prime permissions without blocking UI.
    void refreshLocation();
  }, [refreshLocation]);

  const onTakePhoto = useCallback(async () => {
    if (!camera.granted) return;
    const res = await takePhoto();
    if (!res?.uri) return;
    setPhotoUri(res.uri);
    setStage("preview");
  }, [camera.granted, takePhoto]);

  const onConfirmPhoto = useCallback(async () => {
    if (!photoUri) return;
    setConfirmedUri(photoUri);
    setGeocodeError(null);
    setIsGeocoding(true);
    setAddress("");

    try {
      const locPerm = await refreshLocation();
      if (!locPerm.granted) {
        setGeocodeError("Location permission is required to resolve address.");
        setAddress("Address unavailable");
        return;
      }

      const current = await getCurrentLocation();
      if (!current) {
        setGeocodeError("Unable to fetch location.");
        setAddress("Address unavailable");
        return;
      }
      setEntryCoords(current);

      const resolved = await reverseGeocodeAddress(current);
      setAddress(resolved);
    } catch (e) {
      setGeocodeError("Unable to resolve address.");
      setAddress("Address unavailable");
    } finally {
      setIsGeocoding(false);
    }
  }, [getCurrentLocation, photoUri, refreshLocation]);

  const canSave = useMemo(() => {
    return (
      !isSaving &&
      confirmedUri !== null &&
      address.trim().length > 0 &&
      !isGeocoding &&
      address !== "Address unavailable"
    );
  }, [address, confirmedUri, isGeocoding, isSaving]);

  const save = useCallback(async () => {
    if (!confirmedUri) {
      Alert.alert("Missing photo", "Please take a photo first.");
      return;
    }
    if (isGeocoding || address.trim().length === 0) {
      Alert.alert("Address not ready", "Please wait for the address to finish resolving.");
      return;
    }
    if (address === "Address unavailable") {
      Alert.alert("Address unavailable", "We couldn't resolve an address for this location.");
      return;
    }

    setIsSaving(true);
    try {
      const entry = await addEntry({
        imageUri: confirmedUri,
        address,
        coords: entryCoords,
      });
      if (!entry) return;

      await scheduleEntrySavedNotification(entry.address);

      navigation.goBack();
    } finally {
      setIsSaving(false);
    }
  }, [
    addEntry,
    address,
    confirmedUri,
    entryCoords,
    isGeocoding,
    navigation,
  ]);

  const cameraPanel = useMemo(
    () => (
      <PermissionPanel
        title="Camera permission"
        description="Travel Diary needs camera access to take a photo for your entry."
        permission={camera}
        onRequest={() => void requestCamera()}
      />
    ),
    [camera, requestCamera]
  );

  const locationPanel = useMemo(
    () => (
      <PermissionPanel
        title="Location permission"
        description="We use your current location to resolve an address for the entry."
        permission={location}
        onRequest={() => void requestLocation()}
      />
    ),
    [location, requestLocation]
  );

  return (
    <ScreenGradient>
      <SafeAreaView style={styles.safe} edges={["bottom"]}>
        <FadeInSlideUp>
          <View style={styles.stack}>
            {!camera.granted && cameraPanel}
            {camera.granted && !location.granted && locationPanel}

            <GlassCard>
              <Text style={[styles.title, { color: theme.textPrimary }]}>New travel entry</Text>

              {stage === "camera" ? (
                <View style={styles.cameraWrap}>
                  {camera.granted ? (
                    <CameraView ref={cameraRef} style={styles.camera} facing="back" />
                  ) : (
                    <Text style={[styles.body, { color: theme.textSecondary }]}>
                      Camera permission is required.
                    </Text>
                  )}
                </View>
              ) : (
                <View style={styles.previewWrap}>
                  {photoUri ? (
                    <Image source={{ uri: photoUri }} style={styles.preview} />
                  ) : null}
                </View>
              )}

              {!!cameraError && (
                <Text style={[styles.error, { color: theme.warning }]}>{cameraError}</Text>
              )}
              {!!locationError && (
                <Text style={[styles.error, { color: theme.warning }]}>{locationError}</Text>
              )}
              {!!geocodeError && (
                <Text style={[styles.error, { color: theme.warning }]}>{geocodeError}</Text>
              )}

              {confirmedUri ? (
                <View style={styles.addressBox}>
                  {isGeocoding || isLocating ? (
                    <LoadingInline label="Resolving address..." />
                  ) : (
                    <Text style={[styles.address, { color: theme.textSecondary }]}>
                      {address.trim().length > 0 ? address : "Address unavailable"}
                    </Text>
                  )}
                </View>
              ) : null}

              <View style={styles.actions}>
                {stage === "camera" ? (
                  <GlassButton
                    title={isCapturing ? "Capturing..." : "Take photo"}
                    onPress={onTakePhoto}
                    disabled={!camera.granted || isCapturing}
                  />
                ) : (
                  <View style={styles.row}>
                    <View style={styles.flex}>
                      <GlassButton
                        title="Retake"
                        onPress={() => {
                          setStage("camera");
                          setPhotoUri(null);
                          setConfirmedUri(null);
                          setAddress("");
                          setGeocodeError(null);
                        }}
                      />
                    </View>
                    <View style={styles.flex}>
                      <GlassButton
                        title={confirmedUri ? "Selected" : "Use photo"}
                        onPress={onConfirmPhoto}
                        disabled={confirmedUri !== null || isGeocoding || isLocating}
                      />
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.saveRow}>
                <GlassButton
                  title={isSaving ? "Saving..." : "Save entry"}
                  onPress={save}
                  disabled={!canSave}
                />
              </View>
            </GlassCard>
          </View>
        </FadeInSlideUp>
      </SafeAreaView>
    </ScreenGradient>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
  },
  stack: {
    gap: SPACING.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: SPACING.md,
  },
  body: {
    fontSize: 14,
    fontWeight: "600",
  },
  cameraWrap: {
    height: 320,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    marginBottom: SPACING.md,
  },
  camera: {
    flex: 1,
  },
  previewWrap: {
    height: 320,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    marginBottom: SPACING.md,
  },
  preview: {
    flex: 1,
  },
  error: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: SPACING.xs,
  },
  addressBox: {
    marginTop: SPACING.md,
  },
  address: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  actions: {
    marginTop: SPACING.lg,
  },
  row: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  flex: {
    flex: 1,
  },
  saveRow: {
    marginTop: SPACING.lg,
  },
});

