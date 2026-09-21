import type { ClaimDefinition } from "../types";

/**
 * A syntactically valid HS256 token with a far-future `exp`. The signature is
 * illustrative only — this tool never verifies signatures.
 */
export const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjo0MTAyNDQ0ODAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

/** JWT with a non-ASCII payload, used to verify UTF-8 decoding. */
export const UNICODE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoi4oCUIG5hw692ZSDinJMifQ.c2ln";

export const REGISTERED_CLAIMS: ClaimDefinition[] = [
  { key: "iss", label: "Issuer" },
  { key: "sub", label: "Subject" },
  { key: "aud", label: "Audience" },
  { key: "exp", label: "Expires at", time: true },
  { key: "nbf", label: "Not before", time: true },
  { key: "iat", label: "Issued at", time: true },
  { key: "jti", label: "JWT ID" }
];
