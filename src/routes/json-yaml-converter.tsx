import { createFileRoute, ClientOnly } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { JsonYamlConverter } from "@/features/json-yaml-converter/components/json-yaml-converter"
import { generateToolHead } from "@/lib/seo"

export const Route = createFileRoute('/json-yaml-converter')({
  component: JsonYamlConverterPage,
  head: () => generateToolHead('jsonYamlConverter'),
})

function JsonYamlConverterPage() {
  return (
    <main className="container mx-auto p-6 space-y-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <PageHeader
          title="JSON to YAML Converter"
          subtitle="Convert JSON to YAML and YAML back to JSON instantly in your browser. Precise error locations, nothing ever uploaded."
        />

        <div className="w-full max-w-6xl mx-auto">
          <ClientOnly fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
            <JsonYamlConverter />
          </ClientOnly>
        </div>

        {/* How It Works */}
        <section className="mb-12">
          <HowItWorks
            steps={[
              {
                title: "Paste JSON or YAML",
                description:
                  "Paste JSON or YAML into the left pane and pick the conversion direction. The document is parsed as you type, with the line and column of any syntax error."
              },
              {
                title: "Convert",
                description:
                  "The converted document appears immediately. Choose 2 or 4 space indentation to match your project's style."
              },
              {
                title: "Copy or Swap",
                description:
                  "Copy the result with one click, or hit Swap to convert the output back into the other format."
              }
            ]}
            description="Conversion happens instantly as you type."
          />
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto">
          <FAQSection
            title="Frequently Asked Questions"
            items={[
              {
                question: "Is my data sent to a server?",
                answer:
                  "No. Parsing and conversion happen entirely in your browser using a bundled YAML parser. Your JSON and YAML never leave your device."
              },
              {
                question: "Does it support comments and anchors in YAML?",
                answer:
                  "Yes. Anchors, aliases, and block scalars are resolved during parsing. YAML comments are not carried into JSON, since JSON has no comment syntax."
              },
              {
                question: "How accurate is the error reporting?",
                answer:
                  "Malformed input reports the line and column where parsing stopped, so you can jump straight to the problem in large documents."
              },
              {
                question: "Which indentation options are available?",
                answer:
                  "You can choose 2 or 4 spaces. The setting controls the YAML output when converting from JSON and the JSON output when converting from YAML."
              }
            ]}
          />
        </section>
      </div>
    </main>
  )
}
