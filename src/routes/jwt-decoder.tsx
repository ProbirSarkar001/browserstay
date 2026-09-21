import { createFileRoute, ClientOnly } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { JwtDecoder } from "@/features/jwt-decoder/components/jwt-decoder"
import { generateToolHead } from "@/lib/seo"

export const Route = createFileRoute('/jwt-decoder')({
  component: JwtDecoderPage,
  head: () => generateToolHead('jwtDecoder'),
})

function JwtDecoderPage() {
  return (
    <main className="container mx-auto p-6 space-y-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <PageHeader
          title="JWT Decoder"
          subtitle="Decode a JSON Web Token's header, payload, and claims instantly. Nothing is uploaded and no signature is ever sent anywhere."
        />

        <div className="w-full max-w-6xl mx-auto">
          <ClientOnly fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}>
            <JwtDecoder />
          </ClientOnly>
        </div>

        {/* How It Works */}
        <section className="mb-12">
          <HowItWorks
            steps={[
              {
                title: "Paste a token",
                description:
                  "Paste the raw JWT from an Authorization header, cookie, or log. Decoding happens as you type."
              },
              {
                title: "Read the parts",
                description:
                  "The header and payload are decoded from Base64URL and pretty-printed. Registered claims like exp and iat are shown as readable dates."
              },
              {
                title: "Copy what you need",
                description:
                  "Copy the header or payload JSON with one click. Your token never leaves your browser."
              }
            ]}
            description="Decoding happens instantly as you type."
          />
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto">
          <FAQSection
            title="Frequently Asked Questions"
            items={[
              {
                question: "Is my token sent to a server?",
                answer:
                  "No. Decoding happens entirely in your browser. The token never leaves your device, which matters because a JWT is a bearer credential."
              },
              {
                question: "Does it verify the signature?",
                answer:
                  "No. Verification requires the signing secret or public key. This tool only decodes the header and payload, and it never asks for a key."
              },
              {
                question: "Should I paste production tokens here?",
                answer:
                  "A JWT is a password-equivalent credential. Prefer test tokens; if you must inspect a live one, treat it as exposed and rotate it afterwards."
              },
              {
                question: "Why does an unsigned token have an empty signature?",
                answer:
                  "Tokens using alg 'none' end with a trailing dot and no signature. The decoder still shows the header and payload."
              }
            ]}
          />
        </section>
      </div>
    </main>
  )
}
