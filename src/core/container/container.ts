type Constructor<T> = new (...args: unknown[]) => T;

export class Container {
  private readonly instances = new Map<Function, unknown>();

  register<T>(token: Constructor<T>, instance: T): void {
    this.instances.set(token, instance);
  }

  resolve<T>(token: Constructor<T>): T {
    const existing = this.instances.get(token);
    if (existing) {
      return existing as T;
    }

    const dependencies = ((token as unknown as { inject?: Constructor<unknown>[] }).inject ?? []).map((dep) =>
      this.resolve(dep)
    );

    const created = new token(...dependencies);
    this.instances.set(token, created);
    return created;
  }
}

export const container = new Container();

