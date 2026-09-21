import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { JsonFormatter } from "@/features/json-formatter/components/json-formatter"
import { generateToolHead } from "@/lib/seo"

export const Route = createFileRoute('/json-formatter')({
  component: JsonFormatterPage,
  head: () => generateToolHead('jsonFormatter'),
})

function JsonFormatterPage() {
  return (
    <main className="container mx-auto p-6 space-y-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <PageHeader
          title="JSON Formatter & Validator"
          subtitle="Format, validate, and minify JSON instantly in your browser. Precise error locations, nothing ever uploaded."
        />

        <div className="w-full max-w-6xl mx-auto">
          <JsonFormatter />
        </div>

        {/* How It Works */}
        <section className="mb-12">
          <HowItWorks
            steps={[
              {
                title: "Paste JSON",
                description:
                  "Paste raw or minified JSON into the input pane. It is validated as you type, with exact line and column for any syntax error."
              },
              {
                title: "Format or Minify",
                description:
                  "Click Format to beautify with your preferred indentation, or Minify to strip all whitespace for the smallest output."
              },
              {
                title: "Copy & Use",
                description: "Copy the formatted result with one click. Your JSON is never sent to any server."
              }
            ]}
            description="Formatting JSON takes less than a millisecond."
          />
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto">
          <FAQSection
            title="Frequently Asked Questions"
            items={[
              {
                question: "Is my JSON sent to a server?",
                answer:
                  "No. Parsing and formatting happens entirely in your browser using the built-in JSON engine. Your data never leaves your device."
              },
              {
                question: "How accurate is the error reporting?",
                answer:
                  "Errors show the exact line and column where parsing stopped, so you can jump straight to the problem in large documents."
              },
              {
                question: "Does it support large JSON files?",
                answer:
                  "Yes. The native JSON parser is fast and handles documents with tens of thousands of lines comfortably."
              },
              {
                question: "What indentation options are available?",
                answer:
                  "You can choose 2 spaces, 4 spaces, or tabs. The setting applies when you click Format."
              }
            ]}
          />
        </section>
      </div>
    </main>
  )
}
