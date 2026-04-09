export type Constructor<T = unknown> = new (...args: any[]) => T;
export type InjectionToken<T = unknown> = Constructor<T> | string | symbol;

export interface ClassProvider<T = unknown> {
  provide: InjectionToken<T>;
  useClass: Constructor<T>;
  inject?: InjectionToken[];
}

export interface ValueProvider<T = unknown> {
  provide: InjectionToken<T>;
  useValue: T;
}

export interface FactoryProvider<T = unknown> {
  provide: InjectionToken<T>;
  useFactory: (...args: unknown[]) => T;
  inject?: InjectionToken[];
}

export type Provider<T = unknown> = Constructor<T> | ClassProvider<T> | ValueProvider<T> | FactoryProvider<T>;

export function isClassProvider<T = unknown>(provider: Provider<T>): provider is ClassProvider<T> {
  return typeof provider === "object" && provider !== null && "useClass" in provider;
}

export function isValueProvider<T = unknown>(provider: Provider<T>): provider is ValueProvider<T> {
  return typeof provider === "object" && provider !== null && "useValue" in provider;
}

export function isFactoryProvider<T = unknown>(provider: Provider<T>): provider is FactoryProvider<T> {
  return typeof provider === "object" && provider !== null && "useFactory" in provider;
}

