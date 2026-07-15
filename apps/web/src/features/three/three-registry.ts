/**
 * Three Registry — Generic Registration Surface for Future 3D Subsystems
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "Scenes, cameras, lights, and assets register with the 3D root so the
 *  engine can coordinate lifecycle, disposal, and quality scaling centrally."
 *
 * Phase 6.1 establishes the empty registration slots the provider exposes.
 * Later phases (6.2 scenes, 6.3 cameras, 6.4 lights, 6.7 assets) register their
 * objects here so the engine has a single lifecycle owner. This is a thin,
 * generic Map wrapper — no domain logic, no rendering.
 *
 * Phase 6.1: React Three Fiber setup — infrastructure only.
 */

import type { ThreeRegistry, ThreeRegistryEntry } from './three.types';

/**
 * Create an isolated, generic registry.
 *
 * Each registry owns its own backing Map. Registration is idempotent by id
 * (re-registering replaces the value). `getAll` returns a fresh array snapshot
 * so callers cannot mutate internal state.
 *
 * @typeParam T - The registered value type.
 */
export function createThreeRegistry<T>(): ThreeRegistry<T> {
  const entries = new Map<string, T>();

  function register(id: string, value: T): void {
    entries.set(id, value);
  }

  function unregister(id: string): void {
    entries.delete(id);
  }

  function get(id: string): T | undefined {
    return entries.get(id);
  }

  function getAll(): readonly ThreeRegistryEntry<T>[] {
    return [...entries.entries()].map(([id, value]) => ({ id, value }));
  }

  function has(id: string): boolean {
    return entries.has(id);
  }

  function size(): number {
    return entries.size;
  }

  return Object.freeze({
    register,
    unregister,
    get,
    getAll,
    has,
    size,
  });
}
