import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { PageHeader } from "@/shared/components/layout/page-header";
import { HowItWorks } from "@/shared/components/layout/how-it-works";
import { FAQSection } from "@/shared/components/layout/faq-section";
import { PdfToMarkdownProvider } from "@/features/pdf-to-markdown/context";
import { PdfToMarkdownDropZone } from "@/features/pdf-to-markdown/components/drop-zone";
import { PdfToMarkdownFileDetails } from "@/features/pdf-to-markdown/components/file-details";
import { PdfToMarkdownSettings } from "@/features/pdf-to-markdown/components/settings";
import { PdfToMarkdownActionCard } from "@/features/pdf-to-markdown/components/action-card";
import { PdfToMarkdownResultPreview } from "@/features/pdf-to-markdown/components/result-preview";
import { usePdfToMarkdownContext } from "@/features/pdf-to-markdown/context";
import { generateToolHead } from "@/lib/seo";

const pdfToMarkdownFaqItems = [
  {
    question: "Is my data safe?",
    answer:
      "Yes! All processing happens locally in your browser using WebAssembly. Your PDF is never uploaded to any server.",
  },
  {
    question: "Which PDFs work best?",
    answer:
      "Text-based PDFs — reports, papers, invoices, and legal documents — convert best. Scanned or image-only PDFs need OCR and may produce little or no text.",
  },
  {
    question: "What Markdown features are supported?",
    answer:
      "Headings, bullet and numbered lists, tables, bold and italic text, code blocks, hyperlinks, and multi-column reading order are detected automatically.",
  },
  {
    question: "Does it work with password-protected PDFs?",
    answer:
      "Yes. If your PDF is encrypted we'll ask for its password, which is used locally in your browser to decrypt and convert the file. If you don't know the password, unlock it first with our Unlock PDF tool.",
  },
];

function PdfToMarkdownContent() {
  const { fileData } = usePdfToMarkdownContext();

  return (
    <>
      <PdfToMarkdownFileDetails />
      {!fileData ? <PdfToMarkdownDropZone /> : null}
      <PdfToMarkdownResultPreview />
    </>
  );
}

export const Route = createFileRoute("/pdf-to-markdown")({
  component: PdfToMarkdownPage,
  head: () => generateToolHead("pdfToMarkdown"),
});

function PdfToMarkdownPage() {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="PDF to Markdown"
          subtitle="Convert PDF documents to structured Markdown. Fast, private, and fully local."
        />

        <PdfToMarkdownProvider>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
            <div className="lg:col-span-2 space-y-6">
              <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
                <PdfToMarkdownContent />
              </ClientOnly>
            </div>

            <div className="space-y-6">
              <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
                <PdfToMarkdownSettings />
                <PdfToMarkdownActionCard />
              </ClientOnly>
            </div>
          </div>
        </PdfToMarkdownProvider>

        <section className="mb-24">
          <HowItWorks
            steps={[
              {
                title: "Upload your PDF",
                description: "Drop in a text-based PDF — reports, papers, invoices, or legal docs.",
              },
              {
                title: "Choose options",
                description: "Pick fidelity or compact output, and optionally add page markers.",
              },
              {
                title: "Convert & Download",
                description:
                  "Get structured Markdown with headings, lists, and tables — copy or download instantly.",
              },
            ]}
            description="Turning PDFs into Markdown shouldn't require uploading your files. We keep everything on your device."
          />
        </section>

        <section className="max-w-3xl mx-auto mb-12">
          <FAQSection items={pdfToMarkdownFaqItems} title="Frequently Asked Questions" />
        </section>
      </div>
    </main>
  );
}
