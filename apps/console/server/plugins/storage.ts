import redisDriver from 'unstorage/drivers/redis';

export default defineNitroPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  const storage = useStorage();

  const driver = redisDriver({
    base: 'redis',
    host: runtimeConfig.redis.host,
    port: runtimeConfig.redis.port,
  });

  console.info(
    'mounts',
    storage.getMounts().map((m) => m.base)
  );

  if (
    !storage
      .getMounts()
      .map((m) => m.base)
      .includes('db:')
  )
    storage.mount('db', driver);
});
