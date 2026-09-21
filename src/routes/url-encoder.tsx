import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { UrlEncoder } from "@/features/url-encoder/components/url-encoder"
import { generateToolHead } from "@/lib/seo"

export const Route = createFileRoute('/url-encoder')({
  component: UrlEncoderPage,
  head: () => generateToolHead('urlEncoder'),
})

function UrlEncoderPage() {
  return (
    <main className="container mx-auto p-6 space-y-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <PageHeader
          title="URL Encoder / Decoder"
          subtitle="Percent-encode URLs and query strings instantly in your browser. Component and full-URL modes, nothing ever uploaded."
        />

        <div className="w-full max-w-6xl mx-auto">
          <UrlEncoder />
        </div>

        {/* How It Works */}
        <section className="mb-12">
          <HowItWorks
            steps={[
              {
                title: "Choose a Direction",
                description: "Switch between Encode and Decode depending on whether you have plain or percent-encoded input."
              },
              {
                title: "Pick a Mode",
                description:
                  "Component mode encodes everything for a query parameter; full-URL mode preserves structural characters like / and :."
              },
              {
                title: "Copy & Use",
                description: "Conversion is live as you type. Swap directions to reverse it, then copy the result."
              }
            ]}
            description="URL encoding happens instantly as you type."
          />
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto">
          <FAQSection
            items={[
              {
                question: "What is the difference between component and full-URL mode?",
                answer:
                  "Component mode (encodeURIComponent) escapes every reserved character, which is what you want for query parameter values. Full-URL mode (encodeURI) keeps characters like '/', '?', and ':' intact so a complete URL still works."
              },
              {
                question: "When should spaces be '+' instead of '%20'?",
                answer:
                  "HTML form submissions (application/x-www-form-urlencoded) traditionally encode spaces as '+'. Most modern APIs expect '%20' — use '+' only when working with legacy form-style query strings."
              },
              {
                question: "Why did decoding fail?",
                answer:
                  "A percent sign followed by two hex digits is an escape sequence. A stray '%' that isn't part of a valid escape makes the input impossible to decode — the tool tells you instead of returning broken output."
              },
              {
                question: "Is my data uploaded anywhere?",
                answer:
                  "No. All encoding and decoding happens locally in your browser."
              }
            ]}
            title="Frequently Asked Questions"
          />
        </section>
      </div>
    </main>
  )
}
