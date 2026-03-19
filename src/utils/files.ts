import * as FileSystem from "expo-file-system/legacy";

function getFilenameFromUri(uri: string): string {
  const last = uri.split("/").pop();
  return last && last.trim().length > 0 ? last : `photo-${Date.now()}.jpg`;
}

export async function persistImageToAppStorage(sourceUri: string): Promise<string> {
  const dir = `${FileSystem.documentDirectory ?? ""}travel-diary`;
  const filename = `${Date.now()}-${getFilenameFromUri(sourceUri)}`;
  const target = `${dir}/${filename}`;

  const dirInfo = await FileSystem.getInfoAsync(dir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }

  await FileSystem.copyAsync({ from: sourceUri, to: target });
  return target;
}

export async function safeDeleteFile(uri: string): Promise<void> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists) {
      await FileSystem.deleteAsync(uri, { idempotent: true });
    }
  } catch {
    // Best-effort cleanup; ignore.
  }
}

