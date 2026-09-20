import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { PageHeader } from "@/shared/components/layout/page-header";
import { HowItWorks } from "@/shared/components/layout/how-it-works";
import { FAQSection } from "@/shared/components/layout/faq-section";
import { RemoveImageMetadata } from "@/features/remove-image-metadata/remove-image-metadata";
import { RemoveImageMetadataProvider } from "@/features/remove-image-metadata/context";
import { generateToolHead } from "@/lib/seo";

const removeImageMetadataFaqItems = [
  {
    question: "What metadata is removed?",
    answer:
      "EXIF data including GPS coordinates, capture date and time, camera or phone model, lens settings, and software tags. The visible image stays the same — only hidden data is stripped.",
  },
  {
    question: "Will this change my photo quality?",
    answer:
      "With 'Keep original format' enabled, images are re-encoded at maximum quality (100%). JPEG and WebP may have imperceptible changes; PNG output is lossless. The goal is privacy, not compression.",
  },
  {
    question: "Are my photos uploaded to a server?",
    answer:
      "No. Images are decoded and re-encoded entirely in your browser using WebAssembly. Nothing is sent to our servers or any third party.",
  },
  {
    question: "What happens to HEIC files from iPhone?",
    answer:
      "HEIC cannot be re-encoded in the browser, so cleaned HEIC photos are saved as high-quality JPEG files with all metadata removed.",
  },
];

export const Route = createFileRoute("/remove-image-metadata")({
  component: RemoveImageMetadataPage,
  head: () => generateToolHead("removeImageMetadata"),
});

function RemoveImageMetadataPage() {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Remove Image Metadata"
          subtitle="Strip EXIF, GPS, and hidden photo data before sharing. Re-encode images locally at maximum quality — nothing uploaded, 100% private."
        />

        <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
          <RemoveImageMetadataProvider>
            <RemoveImageMetadata />
          </RemoveImageMetadataProvider>
        </ClientOnly>

        <section className="mb-24">
          <HowItWorks
            steps={[
              {
                title: "Upload Images",
                description: "Add photos from your phone or camera. JPG, PNG, WebP, HEIC, and more.",
              },
              {
                title: "Strip Metadata",
                description:
                  "Images are re-encoded from pixel data only — GPS, timestamps, and camera info are removed.",
              },
              {
                title: "Download Clean Files",
                description: "Get metadata-free images instantly. Batch process and download as ZIP.",
              },
            ]}
            description="Remove hidden photo data in three simple steps. Fast, secure, and purely client-side."
          />
        </section>

        <section className="max-w-3xl mx-auto mb-12">
          <FAQSection items={removeImageMetadataFaqItems} title="Frequently Asked Questions" />
        </section>
      </div>
    </main>
  );
}
