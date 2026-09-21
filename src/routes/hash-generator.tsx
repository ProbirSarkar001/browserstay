import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { HashGenerator } from "@/features/hash-generator/components/hash-generator"
import { generateToolHead } from "@/lib/seo"

export const Route = createFileRoute('/hash-generator')({
  component: HashGeneratorPage,
  head: () => generateToolHead('hashGenerator'),
})

function HashGeneratorPage() {
  return (
    <main className="container mx-auto p-6 space-y-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <PageHeader
          title="Hash Generator"
          subtitle="Compute MD5, SHA-1, SHA-256, SHA-384, and SHA-512 checksums instantly in your browser. Your text and files never leave your device."
        />

        <div className="w-full max-w-3xl mx-auto">
          <HashGenerator />
        </div>

        {/* How It Works */}
        <section className="mb-12">
          <HowItWorks
            steps={[
              {
                title: "Enter Text or a File",
                description: "Paste text into the input, or drop a file to compute its checksums. Both stay on your device."
              },
              {
                title: "Get All Hashes",
                description:
                  "MD5, SHA-1, SHA-256, SHA-384, and SHA-512 are computed in a single pass using WebCrypto and WebAssembly."
              },
              {
                title: "Copy & Verify",
                description: "Copy any digest with one click to compare against a published checksum."
              }
            ]}
            description="All five hashes are computed in a single pass."
          />
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto">
          <FAQSection
            items={[
              {
                question: "Which hash algorithm should I use?",
                answer:
                  "For checksums and general integrity, SHA-256 is the modern standard. MD5 and SHA-1 are fast but cryptographically broken — only use them when verifying against legacy checksums that already use them."
              },
              {
                question: "Can I verify a downloaded file's checksum?",
                answer:
                  "Yes. Switch to the File tab, choose the downloaded file, and compare the SHA-256 digest against the one published by the source. Even a single changed bit produces a completely different hash."
              },
              {
                question: "Is my file uploaded anywhere?",
                answer:
                  "No. Hashing runs entirely in your browser using the Web Crypto API and WebAssembly. Files are read locally and never transmitted."
              },
              {
                question: "Can hashes be reversed to recover the input?",
                answer:
                  "No. Hash functions are one-way. However, short or common inputs can be found in precomputed rainbow tables — for password storage, use a dedicated key-derivation function like Argon2 or bcrypt, never a plain hash."
              }
            ]}
            title="Frequently Asked Questions"
          />
        </section>
      </div>
    </main>
  )
}
