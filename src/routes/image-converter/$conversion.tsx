import { createFileRoute, ClientOnly, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/shared/components/layout/page-header";
import { HowItWorks } from "@/shared/components/layout/how-it-works";
import { FAQSection } from "@/shared/components/layout/faq-section";
import { ImageConverter } from "@/features/image-converter/image-converter";
import { ImageConverterProvider } from "@/features/image-converter/context";
import { getConversionBySlug, getSeoForSlug, CONVERSION_SLUGS } from "@/features/image-converter/constants";
import type { ImageFormat } from "@/shared/services/image/types";

export const Route = createFileRoute("/image-converter/$conversion")({
  component: ImageConverterConversionPage,
  head: ({ params }) => getSeoForSlug(params.conversion) ?? {}
});

function ImageConverterConversionPage() {
  const { conversion } = Route.useParams();
  const combo = getConversionBySlug(conversion);

  if (!combo) {
    throw notFound();
  }

  const related = CONVERSION_SLUGS.filter((s) => s.from === combo.from && s.slug !== combo.slug);

  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title={`Convert ${combo.from.toUpperCase()} to ${combo.to.toUpperCase()}`}
          subtitle={`Convert ${combo.from.toUpperCase()} images to ${combo.to.toUpperCase()} format. 100% free and private — processed entirely in your browser.`}
        />

        <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
          <ImageConverterProvider key={conversion} defaultOutputFormat={combo.to as ImageFormat}>
            <ImageConverter />
          </ImageConverterProvider>
        </ClientOnly>

        {related.length > 0 && (
          <section className="my-12">
            <h2 className="text-xl font-semibold mb-4">Convert {combo.from.toUpperCase()} to other formats</h2>
            <div className="flex flex-wrap gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/image-converter/$conversion"
                  params={{ conversion: r.slug }}
                  className="px-4 py-2 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-sm"
                >
                  {r.from.toUpperCase()} → {r.to.toUpperCase()}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-24">
          <HowItWorks
            steps={[
              {
                title: "Add your Images",
                description: `Drag & drop your ${combo.from.toUpperCase()} images.`
              },
              {
                title: "Preview Settings",
                description: `Output format is pre-set to ${combo.to.toUpperCase()}. Adjust quality if needed.`
              },
              {
                title: "Convert & Save",
                description: "Images are processed locally in your browser. Download individually or as a ZIP."
              }
            ]}
            description={`Fast, secure ${combo.from.toUpperCase()} to ${combo.to.toUpperCase()} conversion — purely client-side.`}
          />
        </section>

        <section className="max-w-3xl mx-auto mb-12">
          <FAQSection
            title="Frequently Asked Questions"
            items={[
              {
                question: `Can I convert ${combo.from.toUpperCase()} to ${combo.to.toUpperCase()}?`,
                answer: `Yes! This tool converts ${combo.from.toUpperCase()} images to ${combo.to.toUpperCase()} format entirely in your browser. No uploads required.`
              },
              {
                question: "Is my data private?",
                answer:
                  "Absolutely. All processing happens locally in your browser using WebAssembly. Your images are never uploaded to any server."
              },
              {
                question: "What quality should I use?",
                answer:
                  combo.to === "png"
                    ? "PNG is lossless, so quality has no effect on the output."
                    : "Lower quality values produce smaller files. Start at 80–90% for a good balance of size and quality."
              }
            ]}
          />
        </section>
      </div>
    </main>
  );
}
