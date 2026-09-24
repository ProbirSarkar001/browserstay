import type { PythonExample } from "../types";

export const DEFAULT_AUTO_LOAD_PACKAGES = true;

export const PYTHON_LIMITS = {
  /** Guard against pasting huge files into the editor/worker. */
  MAX_CODE_LENGTH: 200_000
};

export const PYTHON_EXAMPLES: PythonExample[] = [
  {
    id: "basics",
    label: "Basics",
    description: "Variables, f-strings, and the value of the last expression.",
    code: `# Python runs entirely in your browser — nothing is uploaded.
import sys

name = "BrowserStay"
squares = [n * n for n in range(1, 6)]
print(f"Hello, {name}!")
print("Squares:", squares)

# The value of the last expression is shown as the result.
sys.version.split()[0]`
  },
  {
    id: "stdlib",
    label: "Standard library",
    description: "statistics, json, math, and datetime ship with Pyodide.",
    code: `import statistics, json, math, datetime

data = [0.8, 0.4, 1.2, 3.7, 2.6, 5.8]
summary = {
    "mean": round(statistics.mean(data), 3),
    "stdev": round(statistics.stdev(data), 3),
    "median": statistics.median(data),
}
print(json.dumps(summary, indent=2))
print("pi ~", round(math.pi, 5))
print("now:", datetime.datetime.now().isoformat(timespec="seconds"))`
  },
  {
    id: "numpy",
    label: "NumPy",
    description: "Scientific packages are auto-installed from the Pyodide index.",
    code: `import numpy as np

matrix = np.arange(9).reshape(3, 3)
print(matrix)
print("trace:", matrix.trace())
print("mean per column:", matrix.mean(axis=0))`
  },
  {
    id: "text",
    label: "Text processing",
    description: "Regular expressions and counters from the standard library.",
    code: `import re
from collections import Counter

text = """the quick brown fox jumps over the lazy dog
the dog barks and the fox runs"""
words = re.findall(r"[a-z]+", text.lower())
common = Counter(words).most_common(3)
for word, count in common:
    print(f"{word}: {count}")`
  }
];

export const DEFAULT_PYTHON_CODE = PYTHON_EXAMPLES[0].code;