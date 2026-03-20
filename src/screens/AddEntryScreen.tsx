import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
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
import { Button } from "../components/Button";
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

  type PermissionModalKind = "camera" | "location";
  const [permissionModal, setPermissionModal] = useState<PermissionModalKind | null>(null);
  const permissionTranslateY = useRef(new Animated.Value(16)).current;
  const permissionOpacity = useRef(new Animated.Value(0)).current;

  const closePermissionModal = useCallback(() => {
    setPermissionModal(null);
  }, []);

  const onRequestPermission = useCallback(async () => {
    if (!permissionModal) return;
    try {
      if (permissionModal === "camera") {
        await requestCamera();
      } else {
        await requestLocation();
      }
    } finally {
      closePermissionModal();
    }
  }, [closePermissionModal, permissionModal, requestCamera, requestLocation]);

  useEffect(() => {
    if (!permissionModal) return;
    permissionTranslateY.setValue(16);
    permissionOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(permissionTranslateY, {
        toValue: 0,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(permissionOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [permissionModal, permissionOpacity, permissionTranslateY]);

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
    setAddressWarning(null);
    setCanRetryLocation(false);
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
            <View style={styles.formBlock}>
              <View style={[styles.photoFrame, { borderColor: theme.border }]}>
                {photoUri ? (
                  <Image
                    source={{ uri: photoUri }}
                    style={[styles.photoPreview, { borderColor: theme.border }]}
                    resizeMode="cover"
                  />
                ) : null}

                {!photoUri && camera.granted && stage === "camera" ? (
                  <>
                    <View style={styles.photoCameraWrap}>
                      <CameraView ref={cameraRef} style={styles.photoCamera} facing="back" />
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Take photo"
                      disabled={isCapturing}
                      onPress={() => {
                        if (!camera.granted) {
                          setPermissionModal("camera");
                          return;
                        }
                        void onTakePhoto();
                      }}
                      style={({ pressed }) => [styles.photoOverlay, { opacity: pressed ? 0.85 : 1 }]}
                    >
                      <Ionicons name="camera" size={28} color={theme.text} />
                      <Text style={[styles.photoOverlayText, { color: theme.text }]}>TAP TO TAKE PHOTO</Text>
                    </Pressable>
                  </>
                ) : null}

                {!photoUri && stage === "camera" && !camera.granted ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Camera permission required"
                    disabled={isCapturing}
                    onPress={() => setPermissionModal("camera")}
                    style={({ pressed }) => [styles.photoOverlay, { opacity: pressed ? 0.85 : 1 }]}
                  >
                    <Ionicons name="camera" size={28} color={theme.text} />
                    <Text style={[styles.photoOverlayText, { color: theme.text }]}>TAP TO TAKE PHOTO</Text>
                  </Pressable>
                ) : null}
              </View>

              {!photoUri && stage === "camera" ? (
                <View style={styles.refreshRow}>
                  <Button
                    title="Take picture"
                    onPress={() => {
                      if (!camera.granted) {
                        setPermissionModal("camera");
                        return;
                      }
                      void onTakePhoto();
                    }}
                    disabled={isCapturing}
                    variant="secondary"
                    style={styles.fullWidthButton}
                  />
                </View>
              ) : null}

              {!!cameraError && <Text style={[styles.inlineError, { color: theme.danger }]}>{cameraError}</Text>}

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
                        onFocus={() => {
                          setAddressFocused(true);
                          if (!location.granted) setPermissionModal("location");
                        }}
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
                    <Button
                      title="Refresh location"
                      onPress={onRefreshLocation}
                      disabled={isFetchingAddress || isLocating}
                      variant="secondary"
                    />
                  </View>
                ) : null}
              </View>

              <View style={styles.buttonStack}>
                {photoUri ? (
                  <Button
                    title="Retake"
                    onPress={() => {
                      setStage("camera");
                      setPhotoUri(null);
                      setAddressWarning(null);
                      setCanRetryLocation(false);
                      setEntryCoords(null);
                      setIsFetchingAddress(false);
                      setTitleFocused(false);
                      setAddressFocused(false);
                      resetCamera();
                      resetLoc();
                    }}
                    variant="secondary"
                    style={styles.fullWidthButton}
                  />
                ) : null}

                <Button
                  title={isSaving ? "Saving..." : "Save entry"}
                  onPress={save}
                  disabled={!canSave}
                  variant="primary"
                  style={styles.fullWidthButton}
                />
              </View>
            </View>
          </ScrollView>
          <Modal
            transparent
            visible={permissionModal !== null}
            animationType="none"
            onRequestClose={closePermissionModal}
          >
            <Pressable
              style={[
                styles.permissionBackdrop,
                {
                  backgroundColor: theme.isDark
                    ? theme.modalBackdrop.dark
                    : theme.modalBackdrop.light,
                },
              ]}
              onPress={closePermissionModal}
            >
              <Animated.View
                style={[
                  styles.permissionBox,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                    borderTopColor: theme.accent,
                    opacity: permissionOpacity,
                    transform: [{ translateY: permissionTranslateY }],
                  },
                ]}
              >
                <Text style={[styles.permissionTitle, { color: theme.text }]}>
                  {permissionModal === "camera" ? "CAMERA PERMISSION" : "LOCATION PERMISSION"}
                </Text>
                <Text style={[styles.permissionBody, { color: theme.textMuted }]}>
                  {permissionModal === "camera"
                    ? "Grant access to take a photo."
                    : "Grant access to fetch your address."}
                </Text>

                <View style={styles.permissionBtnRow}>
                  <Button
                    title="GRANT PERMISSION"
                    variant="primary"
                    onPress={() => {
                      void onRequestPermission();
                    }}
                    style={styles.permissionBtn}
                  />
                  <Button
                    title="DENY"
                    variant="secondary"
                    onPress={closePermissionModal}
                    style={styles.permissionBtn}
                  />
                </View>
              </Animated.View>
            </Pressable>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenGradient>
  );
}
