export interface UuidFormatOptions {
  uppercase: boolean;
  noHyphens: boolean;
  braces: boolean;
}

export function generateUuids(count: number): string[] {
  return Array.from({ length: count }, () => crypto.randomUUID());
}

export function formatUuid(uuid: string, options: UuidFormatOptions): string {
  let result = options.noHyphens ? uuid.replace(/-/g, "") : uuid;
  if (options.uppercase) {
    result = result.toUpperCase();
  }
  return options.braces ? `{${result}}` : result;
}
