export type RuntimeStatus = "idle" | "loading" | "ready";

export interface PythonExample {
  id: string;
  label: string;
  description: string;
  code: string;
}