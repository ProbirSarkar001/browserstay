/**
 * @human Awaits a promise and returns `[value, null]` on success or
 * `[null, error]` on failure, so callers handle both outcomes without a
 * `try`/`catch` block.
 */
export async function safe<T, E = Error>(promise: Promise<T>): Promise<[T, null] | [null, E]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (err) {
    return [null, err as E];
  }
}

/**
 * @human Synchronous counterpart of {@link safe}. Takes a function so the work
 * happens inside the `try` rather than before the call.
 */
export function safeSync<T, E = Error>(fn: () => T): [T, null] | [null, E] {
  try {
    return [fn(), null];
  } catch (err) {
    return [null, err as E];
  }
}
