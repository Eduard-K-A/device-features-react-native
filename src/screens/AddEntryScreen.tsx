import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView } from "expo-camera";
import { useFocusEffect } from "@react-navigation/native";
import { ScreenGradient } from "../components/ScreenGradient";
import { GlassCard } from "../components/GlassCard";
import { GlassButton } from "../components/GlassButton";
import { FadeInSlideUp } from "../components/FadeInSlideUp";
import { PermissionPanel } from "../components/PermissionPanel";
import { Header } from "../components/Header";
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
  const [pictureTitle, setPictureTitle] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [addressWarning, setAddressWarning] = useState<string | null>(null);
  const [canRetryLocation, setCanRetryLocation] = useState<boolean>(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [entryCoords, setEntryCoords] = useState<Coordinates | null>(null);
  const [addressTouched, setAddressTouched] = useState<boolean>(false);
  const addressTouchedRef = useRef<boolean>(false);

  const resetAll = useCallback(() => {
    setStage("camera");
    setPhotoUri(null);
    setPictureTitle("");
    setAddress("");
    setAddressWarning(null);
    setCanRetryLocation(false);
    setIsFetchingAddress(false);
    setIsSaving(false);
    setEntryCoords(null);
    setAddressTouched(false);
    addressTouchedRef.current = false;
    resetCamera();
    resetLoc();
  }, [resetCamera, resetLoc]);

  useFocusEffect(
    useCallback(() => {
      resetAll();
      return () => resetAll();
    }, [resetAll])
  );

  useEffect(() => {
    void refreshLocation();
  }, [refreshLocation]);

  const resolveAddress = useCallback(async () => {
    setAddressWarning(null);
    setIsFetchingAddress(true);
    setCanRetryLocation(false);
    setEntryCoords(null);

    try {
      const locPerm = await refreshLocation();
      if (!locPerm.granted) {
        setAddressWarning("Could not detect location. Please type manually.");
        setCanRetryLocation(true);
        return;
      }

      const current = await getCurrentLocation();
      if (!current) {
        setAddressWarning("Could not detect location. Please type manually.");
        setCanRetryLocation(true);
        return;
      }

      setEntryCoords(current);
      const resolved = await reverseGeocodeAddress(current);
      if (!resolved || resolved === "Address unavailable") {
        setAddressWarning("Could not detect location. Please type manually.");
        setCanRetryLocation(true);
        return;
      }

      if (!addressTouchedRef.current) {
        setAddress(resolved);
      }
    } catch {
      setAddressWarning("Could not detect location. Please type manually.");
      setCanRetryLocation(true);
    } finally {
      setIsFetchingAddress(false);
    }
  }, [getCurrentLocation, refreshLocation, reverseGeocodeAddress]);

  const onTakePhoto = useCallback(async () => {
    if (!camera.granted) return;
    const res = await takePhoto();
    if (!res?.uri) return;
    setPictureTitle("");
    setAddress("");
    setAddressWarning(null);
    setCanRetryLocation(false);
    setAddressTouched(false);
    addressTouchedRef.current = false;
    setPhotoUri(res.uri);
    void resolveAddress();
    setStage("preview");
  }, [camera.granted, resolveAddress, takePhoto]);

  const onRefreshLocation = useCallback(() => {
    void resolveAddress();
  }, [resolveAddress]);

  const canSave = useMemo(() => {
    return (
      !isSaving &&
      photoUri !== null &&
      pictureTitle.trim().length > 0 &&
      address.trim().length > 0 &&
      !isLocating
    );
  }, [address, isLocating, isSaving, photoUri, pictureTitle]);

  const save = useCallback(async () => {
    if (!photoUri) {
      Alert.alert("Missing photo", "Please take a photo first.");
      return;
    }
    if (address.trim().length === 0) {
      Alert.alert("Address required", "Please enter an address to continue.");
      return;
    }
    if (pictureTitle.trim().length === 0) {
      Alert.alert("Missing title", "Please add a title for the picture.");
      return;
    }

    setIsSaving(true);
    try {
      const entry = await addEntry({
        imageUri: photoUri,
        title: pictureTitle,
        address,
        coords: entryCoords,
      });
      if (!entry) return;

      await scheduleEntrySavedNotification(entry.title);

      navigation.goBack();
    } finally {
      setIsSaving(false);
    }
  }, [
    addEntry,
    address,
    entryCoords,
    navigation,
    photoUri,
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <SafeAreaView style={styles.safe} edges={["bottom"]}>
          <FadeInSlideUp>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.stack}
              showsVerticalScrollIndicator={false}
            >
            <Header variant="add-entry" />
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
              {!!addressWarning && <Text style={[styles.error, { color: theme.warning }]}>{addressWarning}</Text>}

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
                        }}
                        placeholder="e.g. Weekend in Rome"
                        placeholderTextColor={theme.textSecondary}
                        autoCapitalize="sentences"
                        returnKeyType="done"
                      />
                    </View>

                    {photoUri ? (
                      <View style={styles.addressBox}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Address</Text>
                        <View style={[styles.inputWrap, { borderColor: theme.glassBorder }]}>
                          <TextInput
                            style={[styles.input, styles.inputNoBorder, { color: theme.textPrimary }]}
                            value={address}
                            onChangeText={(t) => {
                              setAddress(t);
                              setAddressTouched(true);
                              addressTouchedRef.current = true;
                              setAddressWarning(null);
                            }}
                            placeholder={isFetchingAddress ? "Fetching address..." : "Enter address manually"}
                            placeholderTextColor={theme.textSecondary}
                            autoCapitalize="words"
                            returnKeyType="done"
                          />
                          {isFetchingAddress ? (
                            <ActivityIndicator size="small" color={theme.textSecondary} />
                          ) : null}
                        </View>
                        {canRetryLocation ? (
                          <View style={styles.refreshRow}>
                            <GlassButton
                              title="Refresh location"
                              onPress={onRefreshLocation}
                              disabled={isFetchingAddress || isLocating}
                            />
                          </View>
                        ) : null}
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
                              setPictureTitle("");
                              setAddress("");
                              setAddressWarning(null);
                              setCanRetryLocation(false);
                              setEntryCoords(null);
                              setIsFetchingAddress(false);
                              setAddressTouched(false);
                              addressTouchedRef.current = false;
                            }}
                          />
                        </View>
                        {canRetryLocation ? <View style={styles.flex} /> : null}
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
