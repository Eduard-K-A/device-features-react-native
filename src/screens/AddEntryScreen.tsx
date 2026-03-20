import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView } from "expo-camera";
import { useFocusEffect } from "@react-navigation/native";
import { ScreenGradient } from "../components/ScreenGradient";
import { GlassButton } from "../components/Button";
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
  const [titleFocused, setTitleFocused] = useState<boolean>(false);
  const [addressFocused, setAddressFocused] = useState<boolean>(false);
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
    setTitleFocused(false);
    setAddressFocused(false);
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
        if (!addressTouchedRef.current) setAddress("");
        return;
      }

      const current = await getCurrentLocation();
      if (!current) {
        setAddressWarning("Could not detect location. Please type manually.");
        setCanRetryLocation(true);
        if (!addressTouchedRef.current) setAddress("");
        return;
      }

      setEntryCoords(current);
      const resolved = await reverseGeocodeAddress(current);
      if (!resolved || resolved === "Address unavailable") {
        setAddressWarning("Could not detect location. Please type manually.");
        setCanRetryLocation(true);
        if (!addressTouchedRef.current) setAddress("");
        return;
      }

      if (!addressTouchedRef.current) {
        setAddress(resolved);
      }
    } catch {
      setAddressWarning("Could not detect location. Please type manually.");
      setCanRetryLocation(true);
      if (!addressTouchedRef.current) setAddress("");
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
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top", "left", "right"]}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <Header variant="add-entry" />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {!camera.granted && cameraPanel}
            {camera.granted && !location.granted && locationPanel}

            {camera.granted ? (
              stage === "camera" ? (
                <View style={styles.formBlock}>
                  <View
                    style={[styles.photoFrame, { borderColor: theme.border }]}
                  >
                    <View style={styles.photoCameraWrap}>
                      <CameraView ref={cameraRef} style={styles.photoCamera} facing="back" />
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Take photo"
                      disabled={!camera.granted || isCapturing}
                      onPress={onTakePhoto}
                      style={({ pressed }) => [
                        styles.photoOverlay,
                        { opacity: pressed ? 0.85 : 1 },
                      ]}
                    >
                      <Ionicons name="camera" size={28} color={theme.text} />
                      <Text style={[styles.photoOverlayText, { color: theme.text }]}>
                        TAP TO TAKE PHOTO
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View style={styles.formBlock}>
                  {photoUri ? (
                    <Image
                      source={{ uri: photoUri }}
                      style={[styles.photoPreview, { borderColor: theme.border }]}
                      resizeMode="cover"
                    />
                  ) : null}

                  {!!cameraError && (
                    <Text style={[styles.inlineError, { color: theme.danger }]}>{cameraError}</Text>
                  )}

                  <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>PICTURE TITLE</Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: theme.surface,
                            borderColor: titleFocused ? theme.accent : theme.border,
                          color: theme.text,
                        },
                      ]}
                      value={pictureTitle}
                      onChangeText={setPictureTitle}
                        onFocus={() => setTitleFocused(true)}
                        onBlur={() => setTitleFocused(false)}
                      placeholder="e.g. Weekend in Rome"
                      placeholderTextColor={theme.textMuted}
                      autoCapitalize="sentences"
                      returnKeyType="done"
                    />
                  </View>

                  <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>ADDRESS</Text>
                    <View
                      style={[
                        styles.addressInputWrap,
                        {
                          backgroundColor: theme.surface,
                          borderColor: addressFocused ? theme.accent : theme.border,
                        },
                      ]}
                    >
                      <TextInput
                        style={[styles.addressInput, { color: theme.text }]}
                        value={address}
                        onChangeText={(t) => {
                          setAddress(t);
                          setAddressTouched(true);
                          addressTouchedRef.current = true;
                          setAddressWarning(null);
                        }}
                        onFocus={() => setAddressFocused(true)}
                        onBlur={() => setAddressFocused(false)}
                        placeholder={isFetchingAddress ? "Fetching address..." : "Enter address manually"}
                        placeholderTextColor={theme.textMuted}
                        autoCapitalize="words"
                        returnKeyType="done"
                      />
                      <View style={styles.rightSlot}>
                        {isFetchingAddress ? (
                          <ActivityIndicator size="small" color={theme.textMuted} />
                        ) : address.trim().length > 0 && !addressWarning ? (
                          <Ionicons name="checkmark" size={18} color={theme.accent} />
                        ) : null}
                      </View>
                    </View>

                    {!!addressWarning ? (
                      <Text style={[styles.warningLabel, { color: theme.accentAlt }]}>{addressWarning}</Text>
                    ) : null}

                    {canRetryLocation ? (
                      <View style={styles.refreshRow}>
                        <GlassButton
                          title="Refresh location"
                          onPress={onRefreshLocation}
                          disabled={isFetchingAddress || isLocating}
                          variant="secondary"
                        />
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.buttonStack}>
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
                        setTitleFocused(false);
                        setAddressFocused(false);
                        resetCamera();
                        resetLoc();
                      }}
                      variant="secondary"
                      style={styles.fullWidthButton}
                    />

                    <GlassButton
                      title={isSaving ? "Saving..." : "Save entry"}
                      onPress={save}
                      disabled={!canSave}
                      variant="primary"
                      style={styles.fullWidthButton}
                    />
                  </View>
                </View>
              )
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenGradient>
  );
}
