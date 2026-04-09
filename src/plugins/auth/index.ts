export interface AuthPluginOptions {
  strategy?: "jwt" | "session";
}

export function authPlugin(options: AuthPluginOptions = {}): AuthPluginOptions {
  return {
    strategy: options.strategy ?? "jwt"
  };
}

