import { createFileRoute, ClientOnly } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { ImageColorPalette } from "@/features/image-color-palette/image-color-palette"
import { ImageColorPaletteProvider } from "@/features/image-color-palette/context"
import { generateToolHead } from "@/lib/seo"

const imageColorPaletteFaqItems = [
  {
    question: "How are the colors chosen?",
    answer: "The image is sampled down to roughly 10,000 pixels, similar shades are merged, and the remaining colors are ranked by how visually prominent they are. The most prominent color comes first."
  },
  {
    question: "Why did I get fewer colors than I asked for?",
    answer: "Near-identical shades are merged into a single entry, so a flat or low-contrast image can produce a shorter palette. Raise the color count to keep more of the distinct shades a busy photo contains."
  },
  {
    question: "What are the circles on the image?",
    answer: "Each circle is a movable pointer for one palette color, placed where that color is concentrated. Drag a circle somewhere else and that palette color becomes the color underneath it, so you can steer the palette towards the parts of the image you care about. Arrow keys nudge a focused circle."
  },
  {
    question: "Which image formats are supported?",
    answer: "Any format your browser can display: JPG, PNG, WebP, GIF, AVIF, BMP, and SVG. HEIC and HEIF photos need a decoder the browser does not ship, so convert them first with the Image Converter."
  }
];

export const Route = createFileRoute('/image-color-palette')({
  component: ImageColorPalettePage,
  head: () => generateToolHead('imageColorPalette'),
})

function ImageColorPalettePage() {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Image Color Palette"
          subtitle="Pull the dominant colors out of any image. Drag the pointers to steer the palette, copy colors as HEX, RGB, or HSL, and export it as CSS, Tailwind, JSON, or PNG. 100% free and private."
        />

        <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
          <ImageColorPaletteProvider>
            <ImageColorPalette />
          </ImageColorPaletteProvider>
        </ClientOnly>

        <section className="mb-24">
          <HowItWorks
            steps={[
              {
                title: "Upload an Image",
                description: "Drag & drop a photo, logo, or screenshot. JPG, PNG, WebP, GIF, AVIF, and SVG all work."
              },
              {
                title: "Read the Palette",
                description: "Colors are extracted automatically. Adjust the color count, switch between HEX, RGB, and HSL, and drag the circles to choose where each color is taken from."
              },
              {
                title: "Copy & Export",
                description: "Copy any color, copy the whole palette, or download it as CSS variables, a Tailwind theme, JSON, or a PNG swatch sheet."
              }
            ]}
            description="Extract a color palette in three steps. Everything runs locally in your browser."
          />
        </section>

        <section className="max-w-3xl mx-auto mb-12">
          <FAQSection items={imageColorPaletteFaqItems} title="Frequently Asked Questions" />
        </section>
      </div>
    </main>
  )
}
