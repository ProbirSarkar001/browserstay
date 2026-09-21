import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { UuidGenerator } from "@/features/uuid-generator/components/uuid-generator"
import { generateToolHead } from "@/lib/seo"

export const Route = createFileRoute('/uuid-generator')({
  component: UuidGeneratorPage,
  head: () => generateToolHead('uuidGenerator'),
})

function UuidGeneratorPage() {
  return (
    <main className="container mx-auto p-6 space-y-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <PageHeader
          title="UUID Generator"
          subtitle="Generate random UUIDs (v4) in bulk instantly in your browser. Cryptographically random, never sent to a server."
        />

        <div className="w-full max-w-3xl mx-auto">
          <UuidGenerator />
        </div>

        {/* How It Works */}
        <section className="mb-12">
          <HowItWorks
            steps={[
              {
                title: "Choose a Quantity",
                description: "Generate from one to hundreds of UUIDs at once, with custom formatting options."
              },
              {
                title: "Generate",
                description:
                  "UUIDs are created with your browser's cryptographic random number generator — 122 random bits per UUID."
              },
              {
                title: "Copy or Download",
                description: "Copy individual UUIDs, copy them all, or download the list as a text file."
              }
            ]}
            description="Each UUID has 122 bits of cryptographic randomness."
          />
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto">
          <FAQSection
            items={[
              {
                question: "What is a UUID?",
                answer:
                  "A UUID (Universally Unique Identifier) is a 128-bit identifier like '3f2504e0-4f89-41d3-9a0c-0305e82c3301'. Version 4 UUIDs are generated from random numbers, making accidental collisions astronomically unlikely."
              },
              {
                question: "Is a UUID v4 the same as a GUID?",
                answer:
                  "Yes — 'GUID' is Microsoft's name for the same concept. UUID v4 and random GUID are interchangeable terms in practice."
              },
              {
                question: "Can two generated UUIDs ever collide?",
                answer:
                  "Technically possible, practically negligible. You would need to generate billions of UUIDs per second for decades to have a reasonable chance of one collision."
              },
              {
                question: "Are the UUIDs sent to a server?",
                answer:
                  "No. They are generated entirely in your browser using the Web Crypto API and never leave your device."
              }
            ]}
            title="Frequently Asked Questions"
          />
        </section>
      </div>
    </main>
  )
}
