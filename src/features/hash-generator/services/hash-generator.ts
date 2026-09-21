import { md5 as md5Hash } from "hash-wasm";

export interface HashResult {
  algorithm: string;
  digest: string;
}

const SHA_ALGORITHMS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** Computes MD5 (hash-wasm) plus the WebCrypto SHA family over the same bytes. */
export async function hashBytes(bytes: Uint8Array<ArrayBuffer>): Promise<HashResult[]> {
  const digests = await Promise.all([
    md5Hash(bytes),
    ...SHA_ALGORITHMS.map(async (algorithm) => toHex(await crypto.subtle.digest(algorithm, bytes)))
  ]);

  return [
    { algorithm: "MD5", digest: digests[0] },
    ...SHA_ALGORITHMS.map((algorithm, index) => ({ algorithm, digest: digests[index + 1] }))
  ];
}

export function hashText(text: string): Promise<HashResult[]> {
  return hashBytes(new TextEncoder().encode(text));
}
