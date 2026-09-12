import { createFileRoute, ClientOnly, Link } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { ImageConverter } from "@/features/image-converter/image-converter"
import { ImageConverterProvider } from "@/features/image-converter/context"
import { generateToolHead } from "@/lib/seo"
import { CONVERSION_SLUGS } from "@/features/image-converter/constants"

export const Route = createFileRoute('/image-converter/')({
  component: ImageConverterPage,
  head: () => generateToolHead('imageConverter'),
})

const POPULAR_SLUGS = [
  "heic-to-jpeg", "heic-to-png", "heic-to-webp", "heic-to-avif",
  "png-to-jpeg", "png-to-webp", "png-to-avif",
  "jpeg-to-webp", "jpeg-to-avif", "jpeg-to-png",
  "webp-to-jpeg", "webp-to-png", "webp-to-avif",
  "avif-to-jpeg", "avif-to-png", "avif-to-webp",
  "gif-to-png", "gif-to-jpeg", "gif-to-webp", "gif-to-avif",
]

function ImageConverterPage() {
  const popular = POPULAR_SLUGS.map((slug) => CONVERSION_SLUGS.find((s) => s.slug === slug)).filter(Boolean)

  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Image Converter"
        subtitle="Convert images between JPG, PNG, WebP, AVIF, and HEIC with high-quality WebAssembly encoding. Batch processing, 100% free and private."
      />

      <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
        <ImageConverterProvider>
          <ImageConverter />
        </ImageConverterProvider>
      </ClientOnly>

      {popular.length > 0 && (
        <section className="mt-16 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Popular Conversions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {popular.map((s) => (
              <Link
                key={s!.slug}
                to="/image-converter/$conversion"
                params={{ conversion: s!.slug }}
                className="flex items-center justify-center px-4 py-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-sm font-medium"
              >
                {s!.from.toUpperCase()} → {s!.to.toUpperCase()}
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
              description: "Drag & drop your photos. We support JPG, PNG, WebP, AVIF, HEIC, and more."
            },
            {
              title: "Choose a Format",
              description: "Pick your target format (JPEG, PNG, WebP, or AVIF) and quality."
            },
            {
              title: "Convert & Save",
              description: "Images are processed locally in your browser. Download individually or as a ZIP."
            }
          ]}
          description="Convert and optimize your images in three simple steps. Fast, secure, and purely client-side."
        />
      </section>

      <section className="max-w-3xl mx-auto mb-12">
        <FAQSection
          title="Frequently Asked Questions"
          items={[
            {
              question: "Is it really offline?",
              answer: "Processing is 100% local. All image encoding happens in your browser using WebAssembly, and your photos are never uploaded to any server. An internet connection is needed to load the page, but your files never leave your device."
            },
            {
              question: "What formats are supported?",
              answer: "You can convert to JPEG, PNG, WebP, or AVIF. Most common input formats (JPG, PNG, WebP, AVIF, HEIC, GIF, and more) are accepted."
            },
            {
              question: "Which format should I choose?",
              answer: "WebP and AVIF offer the best compression for the web. JPEG is universally supported and great for photos. PNG is lossless and ideal when you need transparency or exact quality."
            },
            {
              question: "Does quality affect every format?",
              answer: "Quality applies to the lossy formats (JPEG, WebP, AVIF). PNG is lossless, so the quality slider has no effect on it."
            },
            {
              question: "Limits on file size?",
              answer: "Since processing is local, the limit depends on your device's memory. Most modern devices can handle very large images easily."
            }
          ]}
        />
      </section>
      </div>
    </main>
  )
}
