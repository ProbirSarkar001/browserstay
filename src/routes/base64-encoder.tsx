import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { Base64Encoder } from "@/features/base64-encoder/components/base64-encoder"
import { generateToolHead } from "@/lib/seo"

export const Route = createFileRoute('/base64-encoder')({
  component: Base64EncoderPage,
  head: () => generateToolHead('base64Encoder'),
})

function Base64EncoderPage() {
  return (
    <main className="container mx-auto p-6 space-y-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <PageHeader
          title="Base64 Encoder / Decoder"
          subtitle="Encode text to Base64 or decode it back instantly in your browser. Unicode-safe, with URL-safe alphabet support."
        />

        <div className="w-full max-w-6xl mx-auto">
          <Base64Encoder />
        </div>

        {/* How It Works */}
        <section className="mb-12">
          <HowItWorks
            steps={[
              {
                title: "Choose a Direction",
                description: "Switch between Encode and Decode depending on whether you have text or Base64 input."
              },
              {
                title: "Paste Your Text",
                description:
                  "Conversion happens live as you type. Emoji and non-Latin characters are handled correctly via UTF-8."
              },
              {
                title: "Copy & Use",
                description: "Swap directions to reverse the conversion, or copy the result. Nothing is sent to any server."
              }
            ]}
            description="Base64 conversion happens instantly as you type."
          />
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto">
          <FAQSection
            items={[
              {
                question: "Is Base64 encryption?",
                answer:
                  "No. Base64 is an encoding, not encryption — it converts binary data into printable text but provides no security. Anyone can decode it."
              },
              {
                question: "Why does my emoji or accented text encode differently here?",
                answer:
                  "This tool encodes the UTF-8 bytes of your text, which is the standard used across the web. Some older tools encoded legacy charsets, producing different output for non-ASCII characters."
              },
              {
                question: "What is URL-safe Base64?",
                answer:
                  "Standard Base64 uses '+' and '/', which have special meanings in URLs. URL-safe Base64 replaces them with '-' and '_' and drops the '=' padding, making the output safe to put in URLs and filenames."
              },
              {
                question: "Is my data uploaded anywhere?",
                answer:
                  "No. Encoding and decoding runs entirely in your browser — your text never leaves your device."
              }
            ]}
            title="Frequently Asked Questions"
          />
        </section>
      </div>
    </main>
  )
}
