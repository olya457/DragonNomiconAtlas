import AsyncStorage from '@react-native-async-storage/async-storage';

export const SAVED_KEY = 'saved_places_v1';

export async function getSavedIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(SAVED_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function setSavedIds(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(ids));
}

export async function toggleSavedId(placeId: string): Promise<string[]> {
  const ids = await getSavedIds();
  const next = ids.includes(placeId) ? ids.filter(x => x !== placeId) : [placeId, ...ids];
  await setSavedIds(next);
  return next;
}
