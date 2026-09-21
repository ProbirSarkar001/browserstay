import { createFileRoute, ClientOnly } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { XmlFormatter } from "@/features/xml-formatter/components/xml-formatter"
import { generateToolHead } from "@/lib/seo"

export const Route = createFileRoute('/xml-formatter')({
  component: XmlFormatterPage,
  head: () => generateToolHead('xmlFormatter'),
})

function XmlFormatterPage() {
  return (
    <main className="container mx-auto p-6 space-y-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <PageHeader
          title="XML Formatter & Validator"
          subtitle="Format, validate, and minify XML instantly in your browser. Precise error locations, nothing ever uploaded."
        />

        <div className="w-full max-w-6xl mx-auto">
          <ClientOnly fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
            <XmlFormatter />
          </ClientOnly>
        </div>

        {/* How It Works */}
        <section className="mb-12">
          <HowItWorks
            steps={[
              {
                title: "Paste XML",
                description:
                  "Paste raw or minified XML into the input pane. It is validated as you type, with the line and column of any syntax error."
              },
              {
                title: "Format or Minify",
                description:
                  "Click Format to indent the document with your preferred spacing, or Minify to strip insignificant whitespace for the smallest output."
              },
              {
                title: "Copy & Use",
                description: "Copy the result with one click. Your XML is never sent to any server."
              }
            ]}
            description="Formatting XML happens instantly as you type."
          />
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto">
          <FAQSection
            title="Frequently Asked Questions"
            items={[
              {
                question: "Is my XML sent to a server?",
                answer:
                  "No. Parsing, validation, and formatting happen entirely in your browser using the native XML parser. Your data never leaves your device."
              },
              {
                question: "How accurate is the error reporting?",
                answer:
                  "When the document is malformed, the tool reports the line and column where parsing stopped so you can jump straight to the problem."
              },
              {
                question: "Does it support large XML files?",
                answer:
                  "Yes. The native parser handles documents with tens of thousands of lines comfortably."
              },
              {
                question: "Are comments and CDATA preserved?",
                answer:
                  "Yes. Comments, processing instructions, DOCTYPE declarations, and CDATA sections are kept as-is and placed at the correct indentation level when formatting."
              }
            ]}
          />
        </section>
      </div>
    </main>
  )
}
