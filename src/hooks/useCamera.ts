import { CameraView, type CameraCapturedPicture } from "expo-camera";
import { useCallback, useRef, useState } from "react";

export interface UseCameraState {
  cameraRef: React.RefObject<CameraView | null>;
  isCapturing: boolean;
  error: string | null;
  takePhoto: () => Promise<CameraCapturedPicture | null>;
  reset: () => void;
}

export function useCamera(): UseCameraState {
  const cameraRef = useRef<CameraView>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setIsCapturing(false);
    setError(null);
  }, []);

  const takePhoto = useCallback(async (): Promise<CameraCapturedPicture | null> => {
    setIsCapturing(true);
    setError(null);
    try {
      const res = await cameraRef.current?.takePictureAsync({
        quality: 0.85,
        skipProcessing: false,
      });
      return res ?? null;
    } catch (e) {
      setError("Unable to capture photo.");
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, []);

  return { cameraRef, isCapturing, error, takePhoto, reset };
}

