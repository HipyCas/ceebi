import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Network } from '@capacitor/network';

export interface DefinedCacheable<I> {
  (
    key: string,
    get: () => I | undefined | Promise<I | undefined>,
    def: I,
  ): {
    value: Ref<typeof def>;
    isLoading: Ref<boolean>;
    isSaving: Ref<boolean>;
  };
}

// TODO Make this only load cache when offline, or maybe make it other function
// TODO Make a "updates" table, which has a timestamp and an "affected" column, so it only reloads when it changes based on some "tags" (if the update may affect)
export function useCacheable<T>(
  key: string,
  get: () => T | undefined | Promise<T | undefined>,
  def?: T,
): { value: Ref<typeof def>; isLoading: Ref<boolean>; isSaving: Ref<boolean> } {
  //@ts-expect-error Giving a weird error
  const value: Ref<T | undefined> = ref(def);
  const isLoading = ref(true);
  const isSaving = ref(false);

  watch(value, async (newVal) => {
    isSaving.value = true;
    await writeCache(key, newVal);
    isSaving.value = false;
  });

  (async () => {
    try {
      value.value = (await readCache(key)) as T;
      isLoading.value = false;
    } catch (e) {
      const res = await get();
      console.info(`[caching ${key}] fetched result:`, res);
      value.value = res;
      isLoading.value = false;
    }
  })();

  return { value, isLoading, isSaving };
}

export function useOffline<T>(
  key: string,
  get: () => T | undefined | Promise<T | undefined>,
) {
  const value: Ref<T | undefined> = ref();
  const isLoading = ref(true);
  const isSaving = ref(false);

  const isOnline = ref(false);
  const knowIfOnline = ref(false);
  Network.getStatus().then((status) => {
    isOnline.value = status.connected;
    knowIfOnline.value = true;
  });

  watch(value, async (newVal) => {
    isSaving.value = true;
    await writeCache(key, newVal);
    isSaving.value = false;
  });

  (async () => {
    try {
      value.value = (await readCache(key)) as T;
      isLoading.value = false;
    } catch (e) {
      const res = await get();
      console.info(`[caching ${key}] fetched result:`, res);
      value.value = res;
      isLoading.value = false;
    }
  })();

  return { value, isLoading, isSaving };
}

function writeCache(key: string, data: any) {
  return Filesystem.writeFile({
    directory: Directory.Cache,
    encoding: Encoding.UTF8,
    path: `cache-${key}`,
    data: JSON.stringify(data),
  });
}

function readCache(key: string) {
  return Filesystem.readFile({
    directory: Directory.Cache,
    path: `cache-${key}`,
    encoding: Encoding.UTF8,
  }).then((res) => JSON.parse(res.data));
}
