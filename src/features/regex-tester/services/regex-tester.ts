import type { RegexMatch, RegexResult } from "../types";

export const MAX_MATCHES = 10_000;

/**
 * @human Tests a regular expression against a string and returns every match
 * with its index, value, and capture groups. Invalid patterns are reported as a
 * failure instead of throwing.
 */
export function testRegex(pattern: string, flags: string, text: string): RegexResult {
  if (!pattern) {
    return { ok: true, matches: [], truncated: false };
  }

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Invalid regular expression" };
  }

  const matches: RegexMatch[] = [];

  if (!regex.global && !regex.sticky) {
    const match = regex.exec(text);
    return { ok: true, matches: match ? [toMatch(match)] : [], truncated: false };
  }

  let match = regex.exec(text);
  while (match !== null && matches.length < MAX_MATCHES) {
    matches.push(toMatch(match));
    if (match[0] === "") {
      regex.lastIndex += 1;
    }
    match = regex.exec(text);
  }

  return { ok: true, matches, truncated: match !== null };
}

/**
 * @human Applies a replacement and returns the resulting text, or an error
 * message when the pattern or replacement is invalid. The `g` flag is added
 * automatically so every match is replaced.
 */
export function applyReplacement(
  pattern: string,
  flags: string,
  replacement: string,
  text: string
): { ok: true; output: string } | { ok: false; message: string } {
  if (!pattern) {
    return { ok: true, output: text };
  }

  try {
    const regex = new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`);
    return { ok: true, output: text.replace(regex, replacement) };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Invalid replacement" };
  }
}

function toMatch(match: RegExpExecArray): RegexMatch {
  return {
    index: match.index,
    end: match.index + match[0].length,
    value: match[0],
    groups: match.slice(1),
    namedGroups: match.groups ? { ...match.groups } : undefined
  };
}
