import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from "react-native";
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
import { usePermissions } from "../hooks/usePermissions";
import { useCamera } from "../hooks/useCamera";
import { useLocation } from "../hooks/useLocation";
import { reverseGeocodeAddress } from "../utils/geocoding";
import { scheduleEntrySavedNotification } from "../hooks/useNotification";
import type { Coordinates } from "../types/entry";
import { styles } from "./AddEntryScreen.styles";

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
  const { isLoading: isLocating, getCurrentLocation, reset: resetLoc } = useLocation();

  const [stage, setStage] = useState<Stage>("camera");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [confirmedUri, setConfirmedUri] = useState<string | null>(null);
  const [pictureTitle, setPictureTitle] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [addressUnavailable, setAddressUnavailable] = useState<boolean>(false);
  const [canRetryLocation, setCanRetryLocation] = useState<boolean>(false);
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [entryCoords, setEntryCoords] = useState<Coordinates | null>(null);

  const resetAll = useCallback(() => {
    setStage("camera");
    setPhotoUri(null);
    setConfirmedUri(null);
    setPictureTitle("");
    setAddress("");
    setAddressUnavailable(false);
    setCanRetryLocation(false);
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

  const resolveAddress = useCallback(async () => {
    setGeocodeError(null);
    setIsGeocoding(true);
    setAddress("");
    setAddressUnavailable(false);
    setCanRetryLocation(false);
    setEntryCoords(null);

    try {
      const locPerm = await refreshLocation();
      if (!locPerm.granted) {
        setGeocodeError("Location permission is required to resolve address.");
        setAddressUnavailable(true);
        return;
      }

      const current = await getCurrentLocation();
      if (!current) {
        setGeocodeError("Unable to fetch location. Please refresh and try again.");
        setAddressUnavailable(true);
        setCanRetryLocation(true);
        return;
      }

      setEntryCoords(current);
      const resolved = await reverseGeocodeAddress(current);
      if (resolved.trim().length === 0 || resolved === "Address unavailable") {
        setGeocodeError("Unable to resolve address. You can enter it manually below.");
        setAddress("");
        setAddressUnavailable(true);
        return;
      }

      setAddress(resolved);
      setAddressUnavailable(false);
    } catch {
      setGeocodeError("Unable to resolve address. You can enter it manually below.");
      setAddress("");
      setAddressUnavailable(true);
      setCanRetryLocation(true);
    } finally {
      setIsGeocoding(false);
    }
  }, [getCurrentLocation, refreshLocation, reverseGeocodeAddress]);

  const onTakePhoto = useCallback(async () => {
    if (!camera.granted) return;
    const res = await takePhoto();
    if (!res?.uri) return;
    setPictureTitle("");
    setAddress("");
    setAddressUnavailable(false);
    setCanRetryLocation(false);
    setGeocodeError(null);
    setPhotoUri(res.uri);
    setStage("preview");
  }, [camera.granted, takePhoto]);

  const onConfirmPhoto = useCallback(async () => {
    if (!photoUri) return;
    setConfirmedUri(photoUri);
    await resolveAddress();
  }, [photoUri, resolveAddress]);

  const onRefreshLocation = useCallback(() => {
    void resolveAddress();
  }, [resolveAddress]);

  const canSave = useMemo(() => {
    return (
      !isSaving &&
      confirmedUri !== null &&
      pictureTitle.trim().length > 0 &&
      address.trim().length > 0 &&
      !isGeocoding &&
      !isLocating
    );
  }, [address, confirmedUri, isGeocoding, isLocating, isSaving, pictureTitle]);

  const save = useCallback(async () => {
    if (!confirmedUri) {
      Alert.alert("Missing photo", "Please take a photo first.");
      return;
    }
    if (isGeocoding || address.trim().length === 0) {
      Alert.alert("Address not ready", "Please wait for the address to finish resolving.");
      return;
    }
    if (pictureTitle.trim().length === 0) {
      Alert.alert("Missing title", "Please add a title for the picture.");
      return;
    }

    setIsSaving(true);
    try {
      const entry = await addEntry({
        imageUri: confirmedUri,
        title: pictureTitle,
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
    pictureTitle,
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
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <SafeAreaView style={styles.safe} edges={["bottom"]}>
          <FadeInSlideUp>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.stack}
              showsVerticalScrollIndicator={false}
            >
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
              {!!geocodeError && (
                <Text style={[styles.error, { color: theme.warning }]}>{geocodeError}</Text>
              )}

              {stage === "preview" ? (
                <>
                    <View style={styles.inputGroup}>
                      <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                        Picture title
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          { color: theme.textPrimary, borderColor: theme.glassBorder },
                        ]}
                        value={pictureTitle}
                        onChangeText={(t) => {
                          setPictureTitle(t);
                          setGeocodeError(null);
                        }}
                        placeholder="e.g. Weekend in Rome"
                        placeholderTextColor={theme.textSecondary}
                        autoCapitalize="sentences"
                        returnKeyType="done"
                      />
                    </View>

                    {confirmedUri ? (
                      <View style={styles.addressBox}>
                        {isGeocoding || isLocating ? (
                          <LoadingInline label="Resolving address..." />
                        ) : (
                          <>
                            {addressUnavailable ? (
                              <>
                                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                                  Address
                                </Text>
                                <TextInput
                                  style={[
                                    styles.input,
                                    {
                                      color: theme.textPrimary,
                                      borderColor: theme.glassBorder,
                                    },
                                  ]}
                                  value={address}
                                  onChangeText={(t) => {
                                    setAddress(t);
                                    setCanRetryLocation(false);
                                    setGeocodeError(null);
                                    setAddressUnavailable(true);
                                  }}
                                  placeholder="Enter address manually"
                                  placeholderTextColor={theme.textSecondary}
                                  autoCapitalize="words"
                                  returnKeyType="done"
                                />
                                {canRetryLocation ? (
                                  <View style={styles.refreshRow}>
                                    <GlassButton
                                      title="Refresh location"
                                      onPress={onRefreshLocation}
                                      disabled={isGeocoding || isLocating}
                                    />
                                  </View>
                                ) : null}
                              </>
                            ) : (
                              <Text style={[styles.address, { color: theme.textSecondary }]}>
                                {address.trim().length > 0 ? address : "Address unavailable"}
                              </Text>
                            )}
                          </>
                        )}
                      </View>
                    ) : null}

                    <View style={styles.actions}>
                      <View style={styles.row}>
                        <View style={styles.flex}>
                          <GlassButton
                            title="Retake"
                            onPress={() => {
                              setStage("camera");
                              setPhotoUri(null);
                              setConfirmedUri(null);
                              setPictureTitle("");
                              setAddress("");
                              setAddressUnavailable(false);
                              setCanRetryLocation(false);
                              setGeocodeError(null);
                              setEntryCoords(null);
                              setIsGeocoding(false);
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
                    </View>

                    <View style={styles.saveRow}>
                      <GlassButton
                        title={isSaving ? "Saving..." : "Save entry"}
                        onPress={save}
                        disabled={!canSave}
                        style={styles.saveButton}
                      />
                    </View>
                </>
              ) : (
                <>
                  <View style={styles.actions}>
                    <GlassButton
                      title={isCapturing ? "Capturing..." : "Take photo"}
                      onPress={onTakePhoto}
                      disabled={!camera.granted || isCapturing}
                    />
                  </View>

                  <View style={styles.saveRow}>
                    <GlassButton
                      title={isSaving ? "Saving..." : "Save entry"}
                      onPress={save}
                      disabled={!canSave}
                      style={styles.saveButton}
                    />
                  </View>
                </>
              )}
            </GlassCard>
            </ScrollView>
          </FadeInSlideUp>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ScreenGradient>
  );
}
