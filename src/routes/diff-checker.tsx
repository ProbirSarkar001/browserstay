import { createFileRoute, ClientOnly } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { DiffChecker } from "@/features/diff-checker/components/diff-checker"
import { generateToolHead } from "@/lib/seo"

export const Route = createFileRoute('/diff-checker')({
  component: DiffCheckerPage,
  head: () => generateToolHead('diffChecker'),
})

function DiffCheckerPage() {
  return (
    <main className="container mx-auto p-6 space-y-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <PageHeader
          title="Diff Checker"
          subtitle="Compare two texts and highlight every added, removed, and unchanged line — entirely in your browser."
        />

        <div className="w-full max-w-6xl mx-auto">
          <ClientOnly fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
            <DiffChecker />
          </ClientOnly>
        </div>

        {/* How It Works */}
        <section className="mb-12">
          <HowItWorks
            steps={[
              {
                title: "Paste both versions",
                description:
                  "Drop the original text in the left pane and the changed text in the right. Line numbers are tracked for each side independently."
              },
              {
                title: "Review the differences",
                description:
                  "Added lines are green, removed lines are red, and unchanged lines stay neutral. Counts summarise the scale of the change."
              },
              {
                title: "Copy the diff",
                description:
                  "Copy a unified-style diff (with +, -, and space prefixes) for a commit message, ticket, or code review."
              }
            ]}
            description="Comparison runs instantly as you type."
          />
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto">
          <FAQSection
            title="Frequently Asked Questions"
            items={[
              {
                question: "Is my text uploaded anywhere?",
                answer:
                  "No. The comparison runs entirely in your browser and nothing is sent to a server, so you can safely diff private code, configs, and documents."
              },
              {
                question: "How does the comparison work?",
                answer:
                  "It uses a longest-common-subsequence algorithm over lines to find the smallest set of additions and deletions. Shared start and end lines are matched exactly."
              },
              {
                question: "Why does one changed line show as a deletion and an addition?",
                answer:
                  "Line-level diffing treats an edited line as removing the old line and adding the new one. That keeps the output deterministic and easy to review."
              },
              {
                question: "Are very large files supported?",
                answer:
                  "Yes, with a safeguard: beyond a few thousand lines the tool switches to a faster coarse diff and says so, rather than blocking your browser."
              }
            ]}
          />
        </section>
      </div>
    </main>
  )
}
