export interface JwtDecodeSuccess {
  ok: true;
  header: unknown;
  payload: unknown;
  signature: string;
}

export interface JwtDecodeFailure {
  ok: false;
  message: string;
}

export type JwtDecodeResult = JwtDecodeSuccess | JwtDecodeFailure;

export interface ClaimDefinition {
  key: string;
  label: string;
  /** Claim holds a Unix timestamp in seconds. */
  time?: boolean;
}
