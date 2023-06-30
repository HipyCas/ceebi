import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { ref } from 'vue';
import type { Ref } from 'vue';
import parseISO from 'date-fns/parseISO';
import formatISO from 'date-fns/formatISO';

const getLastUpdate = async (key: string) => {
  const file = await Filesystem.readFile({
    directory: Directory.Cache,
    path: `cap-cache-date-${JSON.stringify(key, undefined, 0)}`,
    encoding: Encoding.UTF8,
  });
  return {
    isValid: file.data && isValidDate(parseISO(file.data)),
    date: parseISO(file.data),
  };
};

export async function useCache<T>(
  key: string,
  getter: (lastUpdate?: Date) => Promise<Array<T>>
) {
  const data: Ref<Array<T>> = ref([]);
  const loading = ref(false);

  const updateData = (newData: Array<T>) => {
    data.value.push(...newData);
    loading.value = false;
    Filesystem.writeFile({
      directory: Directory.Cache,
      path: `cap-cache-data-${key}`,
      encoding: Encoding.UTF8,
      data: JSON.stringify(newData),
    });
  };

  const lastUpdate = await getLastUpdate(key);

  // TODO If it is not a valid date, throw some error
  if (lastUpdate.isValid) {
    const dataFile = await Filesystem.readFile({
      directory: Directory.Cache,
      path: `cap-cache-data-${key}`,
    });
    data.value = JSON.parse(dataFile.data);
    getter(lastUpdate.date).then(updateData);
  } else {
    getter().then(updateData);
    Filesystem.writeFile({
      directory: Directory.Cache,
      path: `cap-cache-timestamp-${key}`,
      encoding: Encoding.UTF8,
      data: formatISO(new Date()),
    });
  }

  const clearCache = () => {
    Filesystem.deleteFile({
      directory: Directory.Cache,
      path: `cap-cache-timestamp-${key}`,
    });
    Filesystem.deleteFile({
      directory: Directory.Cache,
      path: `cap-cache-timestamp-${JSON.stringify(key, undefined, 0)}`,
    });
  };

  return [data, loading, clearCache];
}

export async function useMultiFileCache<T>(
  key: string,
  srcKey: string,
  getter: (lastUpdate?: Date) => Promise<Array<T>>
) {
  const files: Ref<Array<T & { fileUri: string }>> = ref([]);

  const lastUpdate = getLastUpdate(key);
}

function isValidDate(d: any) {
  // @ts-expect-error isNan works with dates
  return d instanceof Date && !isNaN(d);
}
