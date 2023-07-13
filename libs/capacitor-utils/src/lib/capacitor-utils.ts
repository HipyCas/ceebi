import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { ref } from 'vue';
import type { Ref } from 'vue';
import parseISO from 'date-fns/parseISO';
import formatISO from 'date-fns/formatISO';
import { useLogger, type Logger } from '../../../logger/src/index';
import { FirebaseCrashlytics } from '@capacitor-community/firebase-crashlytics';
import * as StackTrace from 'stacktrace-js';
// import type { } from '@supabase/supabase-js';

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

export async function logCatchError(
  logger: Logger,
  scope: string,
  message: string,
  error: any,
  logErrorWithLogger = true
) {
  if (logErrorWithLogger)
    logger.error(scope, message, {
      error,
    });
  if (!(error instanceof Error)) {
    error = new Error(error);
  }
  StackTrace.fromError(error).then((stacktrace) =>
    FirebaseCrashlytics.recordException({
      message,
      stacktrace,
    })
  );
}

export async function logPostgrestError(
  scope: string,
  message: string,
  data: Record<string, any> | null,
  error: { code: string; hint: string; details: string; message: string }
) {
  useLogger().error(scope, message, { data, error });

  FirebaseCrashlytics.setContext({
    key: 'errorCode',
    type: 'string',
    value: error.code,
  });
  FirebaseCrashlytics.setContext({
    key: 'errorMessage',
    type: 'string',
    value: error.message,
  });
  FirebaseCrashlytics.setContext({
    key: 'errorHint',
    type: 'string',
    value: error.hint,
  });
  FirebaseCrashlytics.setContext({
    key: 'errorDetails',
    type: 'string',
    value: error.details,
  });
  FirebaseCrashlytics.setContext({
    key: 'data',
    type: 'string',
    value: JSON.stringify(data),
  });

  StackTrace.fromError(
    new Error(`PostgrestError ${error.code}: ${error.message}`)
  ).then((stacktrace) =>
    FirebaseCrashlytics.recordException({
      message,
      stacktrace,
    })
  );
}

export async function logStorageError(
  scope: string,
  message: string,
  data: Blob | null,
  error: { cause?: unknown; message: string; name: string; stack?: string } // TODO Get typings right
) {
  useLogger().error(scope, message, { data, error });

  FirebaseCrashlytics.setContext({
    key: 'errorCause',
    type: 'string',
    value: JSON.stringify(error.cause) || '',
  });
  FirebaseCrashlytics.setContext({
    key: 'errorMessage',
    type: 'string',
    value: error.message,
  });
  FirebaseCrashlytics.setContext({
    key: 'errorName',
    type: 'string',
    value: error.name,
  });
  FirebaseCrashlytics.setContext({
    key: 'errorStack',
    type: 'string',
    value: error.stack || '',
  });
  FirebaseCrashlytics.setContext({
    key: 'data',
    type: 'string',
    value: (data ?? '').toString(),
  });

  const e = new Error(message);
  if (error.stack) {
    e.stack = error.stack;
  }
  if (error.name) {
    e.name = error.name;
  }

  StackTrace.fromError(e).then((stacktrace) =>
    FirebaseCrashlytics.recordException({
      message,
      stacktrace,
    })
  );
}
