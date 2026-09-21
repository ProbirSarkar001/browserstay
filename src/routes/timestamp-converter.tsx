import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { TimestampConverter } from "@/features/timestamp-converter/components/timestamp-converter"
import { generateToolHead } from "@/lib/seo"

export const Route = createFileRoute('/timestamp-converter')({
  component: TimestampConverterPage,
  head: () => generateToolHead('timestampConverter'),
})

function TimestampConverterPage() {
  return (
    <main className="container mx-auto p-6 space-y-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <PageHeader
          title="Unix Timestamp Converter"
          subtitle="Convert Unix timestamps to dates and back instantly in your browser. Seconds or milliseconds, local or UTC."
        />

        <div className="w-full max-w-3xl mx-auto">
          <TimestampConverter />
        </div>

        {/* How It Works */}
        <section className="mb-12">
          <HowItWorks
            steps={[
              {
                title: "Watch the Current Time",
                description: "The current Unix time updates live every second — copy it with one click."
              },
              {
                title: "Convert a Timestamp",
                description:
                  "Paste any timestamp in seconds or milliseconds to see the local time, UTC, ISO 8601, and a relative description."
              },
              {
                title: "Convert a Date",
                description: "Pick a date and time to get its Unix timestamp in both seconds and milliseconds."
              }
            ]}
            description="Conversions happen instantly as you type."
          />
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto">
          <FAQSection
            items={[
              {
                question: "What is a Unix timestamp?",
                answer:
                  "A Unix timestamp is the number of seconds elapsed since 1 January 1970 00:00:00 UTC (the 'Unix epoch'). It is a timezone-independent way to store points in time, which is why it is ubiquitous in databases and APIs."
              },
              {
                question: "Should I use seconds or milliseconds?",
                answer:
                  "It depends on the system you are working with. Most Unix tools, databases, and APIs use seconds; JavaScript's Date.now(), Java, and many logging systems use milliseconds. A 10-digit timestamp is seconds; 13 digits is milliseconds."
              },
              {
                question: "Are timestamps affected by timezones?",
                answer:
                  "No — a timestamp is always measured from UTC. This tool shows you the same instant in both your local timezone and UTC so you can see exactly when it refers to."
              },
              {
                question: "What happens in 2038?",
                answer:
                  "Systems storing timestamps in a signed 32-bit integer overflow on 19 January 2038. Modern 64-bit systems and most languages are unaffected, but it is worth checking legacy systems."
              }
            ]}
            title="Frequently Asked Questions"
          />
        </section>
      </div>
    </main>
  )
}
