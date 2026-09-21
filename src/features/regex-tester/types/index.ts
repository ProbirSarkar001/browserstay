export interface RegexMatch {
  index: number;
  end: number;
  value: string;
  /** Numbered capture groups, in order. `undefined` for non-participating groups. */
  groups: (string | undefined)[];
  namedGroups?: Record<string, string | undefined>;
}

export interface RegexSuccess {
  ok: true;
  matches: RegexMatch[];
}

export interface RegexFailure {
  ok: false;
  message: string;
}

export type RegexResult = RegexSuccess | RegexFailure;

export type RegexFlag = "g" | "i" | "m" | "s" | "u";
