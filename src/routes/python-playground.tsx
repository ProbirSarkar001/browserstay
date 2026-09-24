import { createFileRoute, ClientOnly } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { PythonPlayground } from "@/features/python-playground/components/python-playground"
import { generateToolHead } from "@/lib/seo"

const pythonPlaygroundFaqItems = [
  {
    question: "Is my code or its output sent to a server?",
    answer:
      "No. Python runs locally in a Web Worker using Pyodide, a build of CPython compiled to WebAssembly. Your script, its output, and any data you process stay inside the browser tab."
  },
  {
    question: "Which Python version is used?",
    answer:
      "The playground runs the CPython version bundled with the current Pyodide release shown in the status badge (Python 3.14 at the time of writing)."
  },
  {
    question: "Can I import packages like NumPy or pandas?",
    answer:
      "Yes. When Auto-install imports is on, the runtime inspects your script and downloads matching wheels from the Pyodide package index before it runs. Pure-Python packages and the many pre-compiled scientific packages work; packages that need native system libraries may not."
  },
  {
    question: "Why is the first run slow?",
    answer:
      "The first execution downloads the Pyodide WebAssembly runtime (~10 MB) plus any packages your script imports. After that the interpreter stays warm in the worker and subsequent runs start instantly."
  },
  {
    question: "Can I read files or make network requests from Python?",
    answer:
      "This playground is a focused REPL: it captures stdout, stderr, and the value of the last expression. The in-browser filesystem and Pyodide's networking features exist, but are intentionally not exposed here."
  }
];

export const Route = createFileRoute('/python-playground')({
  component: PythonPlaygroundPage,
  head: () => generateToolHead('pythonPlayground'),
})

function PythonPlaygroundPage() {
  return (
    <main className="container mx-auto p-6 space-y-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <PageHeader
          title="Python Playground"
          subtitle="Run Python entirely in your browser — powered by WebAssembly in a Web Worker. No installs, no servers, nothing uploaded."
        />

        <div className="w-full max-w-6xl mx-auto">
          <ClientOnly fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
            <PythonPlayground />
          </ClientOnly>
        </div>

        {/* How It Works */}
        <section className="mb-12">
          <HowItWorks
            steps={[
              {
                title: "Write or load a script",
                description:
                  "Type Python in the editor or pick one of the built-in examples, from plain stdlib snippets to NumPy."
              },
              {
                title: "Run it",
                description:
                  "Press Run (or Ctrl/Cmd + Enter). The first run boots the WebAssembly runtime in a background worker; imports are installed automatically."
              },
              {
                title: "Read the output",
                description:
                  "stdout, stderr, tracebacks, and the value of the final expression are captured live. Copy the result with one click."
              }
            ]}
            description="A real Python interpreter, running on your machine."
          />
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto">
          <FAQSection
            title="Frequently Asked Questions"
            items={pythonPlaygroundFaqItems}
          />
        </section>
      </div>
    </main>
  )
}