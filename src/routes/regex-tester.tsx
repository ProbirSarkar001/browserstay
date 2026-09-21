import { createFileRoute, ClientOnly } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { RegexTester } from "@/features/regex-tester/components/regex-tester"
import { generateToolHead } from "@/lib/seo"

export const Route = createFileRoute('/regex-tester')({
  component: RegexTesterPage,
  head: () => generateToolHead('regexTester'),
})

function RegexTesterPage() {
  return (
    <main className="container mx-auto p-6 space-y-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <PageHeader
          title="Regex Tester"
          subtitle="Test and debug regular expressions live — matches, positions, capture groups, and replacements, all in your browser."
        />

        <div className="w-full max-w-6xl mx-auto">
          <ClientOnly fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
            <RegexTester />
          </ClientOnly>
        </div>

        {/* How It Works */}
        <section className="mb-12">
          <HowItWorks
            steps={[
              {
                title: "Enter a pattern",
                description:
                  "Type the pattern and toggle flags for global, case-insensitive, multiline, dotall, and Unicode matching."
              },
              {
                title: "Add a test string",
                description:
                  "Matches are highlighted as you type, and each one is listed with its index, value, and capture groups."
              },
              {
                title: "Try a replacement",
                description:
                  "Enter a replacement using $1, $2, or $& references to preview the transformed text, then copy the result."
              }
            ]}
            description="Matching runs instantly as you type."
          />
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto">
          <FAQSection
            title="Frequently Asked Questions"
            items={[
              {
                question: "Which regex flavour is used?",
                answer:
                  "The tester uses JavaScript's built-in RegExp engine, the same one your code runs in. That includes named groups, lookbehind, and Unicode property escapes."
              },
              {
                question: "Is my text sent anywhere?",
                answer:
                  "No. Matching runs entirely in your browser, so it is safe for private logs, tokens, and source code."
              },
              {
                question: "Why did my pattern freeze the page?",
                answer:
                  "Some patterns backtrack catastrophically on adversarial input. The tester caps the number of matches, but a single slow match can still block while it runs, so keep test strings small."
              },
              {
                question: "How do I reference capture groups in a replacement?",
                answer:
                  "Use $1, $2 and so on for numbered groups, $<name> for named groups, and $& for the whole match."
              }
            ]}
          />
        </section>
      </div>
    </main>
  )
}
