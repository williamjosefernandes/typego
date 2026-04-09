import { metadata } from "../metadata/metadata.js";
import {
  type Constructor,
  type InjectionToken,
  type Provider,
  isClassProvider,
  isFactoryProvider,
  isValueProvider
} from "./types.js";

export class Container {
      private formatToken(token: InjectionToken): string {
        if (typeof token === "function") {
          return token.name;
        }

        if (typeof token === "symbol") {
          return token.description ?? token.toString();
        }

        return token;
      }

  private readonly instances = new Map<InjectionToken, unknown>();
  private readonly providers = new Map<InjectionToken, Provider>();

  register<T>(token: InjectionToken<T>, instance: T): void {
    this.instances.set(token, instance);
  }

  registerProvider(provider: Provider): void {
    if (typeof provider === "function") {
      this.providers.set(provider, provider);
      return;
    }

    this.providers.set(provider.provide, provider);
  }

  private resolveProvider(token: InjectionToken, provider: Provider, resolving: Set<InjectionToken>): unknown {
    if (isValueProvider(provider)) {
      this.instances.set(token, provider.useValue);
      return provider.useValue;
    }

    if (isFactoryProvider(provider)) {
      const dependencies = (provider.inject ?? []).map((dep) => this.resolve(dep, resolving));
      const created = provider.useFactory(...dependencies);
      this.instances.set(token, created);
      return created;
    }

    if (isClassProvider(provider)) {
      const dependencies = (provider.inject ?? []).map((dep) => this.resolve(dep, resolving));
      const created =
        dependencies.length > 0
          ? new provider.useClass(...dependencies)
          : this.resolve(provider.useClass as Constructor<unknown>, resolving);
      this.instances.set(token, created);
      return created;
    }

    if (typeof provider === "function") {
      const created = this.instantiateClass(provider as Constructor<unknown>, resolving);
      this.instances.set(token, created);
      return created;
    }

    throw new Error(`Invalid provider for token '${String(token)}'.`);
  }

  private instantiateClass<T>(token: Constructor<T>, resolving: Set<InjectionToken>): T {
    const staticDependencies = (token as unknown as { inject?: InjectionToken[] }).inject ?? [];
    const decoratorDependencies = metadata.getInjectableDependencies(token);
    const dependencyTokens = staticDependencies.length > 0 ? staticDependencies : decoratorDependencies;

    if (dependencyTokens.length === 0 && token.length > 0) {
      throw new Error(
        `Cannot resolve '${token.name}' constructor arguments. Add 'static inject = [...]' or use '@Injectable({ inject: [...] })'.`
      );
    }

    const dependencies = dependencyTokens.map((dep) => this.resolve(dep, resolving));
    const created = new token(...dependencies);
    this.instances.set(token, created);
    return created;
  }

  resolve<T>(token: InjectionToken<T>, resolving: Set<InjectionToken> = new Set()): T {
    const existing = this.instances.get(token);
    if (existing) {
      return existing as T;
    }

    if (resolving.has(token)) {
      throw new Error(`Circular dependency detected while resolving '${this.formatToken(token)}'.`);
    }

    resolving.add(token);

    try {
      const provider = this.providers.get(token);
      if (provider) {
        return this.resolveProvider(token, provider, resolving) as T;
      }

      if (typeof token === "function") {
        return this.instantiateClass(token as Constructor<T>, resolving);
      }

      throw new Error(`No provider found for token '${this.formatToken(token)}'.`);
    } finally {
      resolving.delete(token);
    }
  }
}

export const container = new Container();

