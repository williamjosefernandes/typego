export interface CachePluginOptions {
  ttlSeconds?: number;
}

export function cachePlugin(options: CachePluginOptions = {}): CachePluginOptions {
  return {
    ttlSeconds: options.ttlSeconds ?? 60
  };
}

