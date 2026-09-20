import {
  Hammer,
  Palette,
  Lock,
  FileText,
  Image as ImageIcon,
  Scissors,
  Sparkles,
  QrCode,
  Braces,
  FileJson,
  FileSpreadsheet,
  Database,
  FileDiff,
  Binary,
  Link2,
  Hash,
  Fingerprint,
  FileCode,
  Paintbrush,
  Code,
  PenLine,
  KeyRound,
  Regex,
  Globe,
  MonitorSmartphone,
  Clock,
  CalendarClock,
  Pipette,
  LucideIcon
} from "lucide-react";

export interface ToolItem {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
  color: string;
  tags: string[];
  disabled?: boolean;
  /** Sub-group heading inside a category hub page (e.g. "Encoding"). */
  group?: string;
  /** Extra search terms for the command palette. */
  keywords?: string[];
  popular?: boolean;
}

export interface ToolCategory {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
  items: ToolItem[];
}

export const TOOLS_CONFIG: ToolCategory[] = [
  {
    title: "PDF Tools",
    href: "/pdf-tools",
    icon: Hammer,
    description: "Merge, split, compress, and edit PDF documents.",
    items: [
      {
        title: "PDF to Image",
        href: "/pdf-to-image",
        description: "Convert PDF pages to high-quality images.",
        icon: FileText,
        color: "bg-orange-500/10 text-orange-600",
        tags: ["PDF", "Image"],
        popular: true,
        keywords: ["convert", "jpg", "png"]
      },
      {
        title: "Image to PDF",
        href: "/image-to-pdf",
        description: "Convert images to a single PDF document.",
        icon: FileText,
        color: "bg-red-500/10 text-red-600",
        tags: ["Image", "PDF"],
        keywords: ["convert", "jpg", "png"]
      },
      {
        title: "Merge PDF",
        href: "/merge-pdf",
        description: "Combine multiple PDFs into one.",
        icon: Hammer,
        color: "bg-orange-500/10 text-orange-600",
        tags: ["PDF", "Utils"],
        popular: true,
        keywords: ["combine", "join"]
      },
      {
        title: "Split PDF",
        href: "/split-pdf",
        description: "Extract pages or split into multiple files.",
        icon: Scissors,
        color: "bg-orange-500/10 text-orange-600",
        tags: ["PDF", "Editor"],
        keywords: ["extract", "pages"]
      },
      {
        title: "Unlock PDF",
        href: "/unlock-pdf",
        description: "Remove password protection from PDFs.",
        icon: Lock,
        color: "bg-red-500/10 text-red-600",
        tags: ["PDF", "Security"],
        keywords: ["password", "decrypt"]
      },
      {
        title: "Encrypt PDF",
        href: "/encrypt-pdf",
        description: "Protect your PDF with a password.",
        icon: Lock,
        color: "bg-green-500/10 text-green-600",
        tags: ["PDF", "Security"],
        keywords: ["password", "protect"]
      }
    ]
  },
  {
    title: "Image Tools",
    href: "/image-tools",
    icon: Palette,
    description: "Convert, resize, and optimize your images.",
    items: [
      {
        title: "Image Converter",
        href: "/image-converter",
        description: "Batch convert image formats freely.",
        icon: ImageIcon,
        color: "bg-blue-500/10 text-blue-600",
        tags: ["Image", "Optimization"],
        popular: true,
        keywords: ["webp", "png", "jpg", "avif"]
      },
      {
        title: "Image Resizer",
        href: "/image-resize",
        description: "Resize images to any dimension.",
        icon: ImageIcon,
        color: "bg-purple-500/10 text-purple-600",
        tags: ["Image", "Editor"],
        keywords: ["scale", "dimensions"]
      },
      {
        title: "Image Compressor",
        href: "/image-compressor",
        description: "Compress images while maintaining quality.",
        icon: ImageIcon,
        color: "bg-blue-500/10 text-blue-600",
        tags: ["Image", "Optimization"],
        keywords: ["reduce", "size", "optimize"]
      },
      {
        title: "Remove Image Metadata",
        href: "/remove-image-metadata",
        description: "Strip EXIF, GPS, and hidden photo data before sharing.",
        icon: Fingerprint,
        color: "bg-green-500/10 text-green-600",
        tags: ["Image", "Privacy"],
        keywords: ["exif", "metadata", "gps", "strip", "privacy", "location"]
      }
    ]
  },
  {
    title: "Security Tools",
    href: "/security-tools",
    icon: Lock,
    description: "Protect your data and privacy.",
    items: [
      {
        title: "Password Generator",
        href: "/password-generator",
        description: "Create strong, secure passwords.",
        icon: Lock,
        color: "bg-green-500/10 text-green-600",
        tags: ["Security", "Privacy"],
        popular: true,
        keywords: ["random", "secure", "passphrase"]
      }
    ]
  },
  {
    title: "Developer Tools",
    href: "/developer-tools",
    icon: Sparkles,
    description: "Encode, format, convert, and inspect — everyday developer utilities.",
    items: [
      {
        title: "JSON Formatter",
        href: "/json-formatter",
        description: "Format, validate, and beautify JSON.",
        icon: Braces,
        color: "bg-yellow-500/10 text-yellow-600",
        tags: ["JSON", "Formatter"],
        disabled: true,
        group: "JSON & Data",
        keywords: ["beautify", "prettify", "validate", "minify"]
      },
      {
        title: "JSON to YAML",
        href: "/json-yaml-converter",
        description: "Convert JSON to YAML and back.",
        icon: FileJson,
        color: "bg-yellow-500/10 text-yellow-600",
        tags: ["JSON", "YAML", "Converter"],
        disabled: true,
        group: "JSON & Data",
        keywords: ["yaml", "convert"]
      },
      {
        title: "JSON to CSV",
        href: "/json-csv-converter",
        description: "Convert JSON arrays to CSV and back.",
        icon: FileSpreadsheet,
        color: "bg-green-500/10 text-green-600",
        tags: ["JSON", "CSV", "Converter"],
        disabled: true,
        group: "JSON & Data",
        keywords: ["csv", "spreadsheet", "excel", "convert"]
      },
      {
        title: "SQL Formatter",
        href: "/sql-formatter",
        description: "Format and beautify SQL queries.",
        icon: Database,
        color: "bg-indigo-500/10 text-indigo-600",
        tags: ["SQL", "Formatter"],
        disabled: true,
        group: "JSON & Data",
        keywords: ["query", "beautify", "database"]
      },
      {
        title: "Diff Checker",
        href: "/diff-checker",
        description: "Compare two texts and highlight differences.",
        icon: FileDiff,
        color: "bg-rose-500/10 text-rose-600",
        tags: ["Text", "Compare"],
        disabled: true,
        group: "JSON & Data",
        keywords: ["compare", "difference", "text"]
      },
      {
        title: "Base64 Encoder/Decoder",
        href: "/base64-encoder",
        description: "Encode and decode Base64 strings.",
        icon: Binary,
        color: "bg-sky-500/10 text-sky-600",
        tags: ["Encoding", "Dev"],
        disabled: true,
        group: "Encoding",
        keywords: ["encode", "decode", "base64"]
      },
      {
        title: "URL Encoder/Decoder",
        href: "/url-encoder",
        description: "Encode and decode URLs and query strings.",
        icon: Link2,
        color: "bg-cyan-500/10 text-cyan-600",
        tags: ["Encoding", "URL"],
        disabled: true,
        group: "Encoding",
        keywords: ["encode", "decode", "uri", "percent"]
      },
      {
        title: "Hash Generator",
        href: "/hash-generator",
        description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes.",
        icon: Hash,
        color: "bg-orange-500/10 text-orange-600",
        tags: ["Security", "Encoding"],
        disabled: true,
        group: "Encoding",
        keywords: ["md5", "sha256", "checksum", "digest"]
      },
      {
        title: "UUID Generator",
        href: "/uuid-generator",
        description: "Generate random UUIDs (v4) in bulk.",
        icon: Fingerprint,
        color: "bg-violet-500/10 text-violet-600",
        tags: ["Generator", "Dev"],
        disabled: true,
        group: "Encoding",
        keywords: ["guid", "identifier", "random"]
      },
      {
        title: "QR Code Generator",
        href: "/qr-generator",
        description: "Create custom QR codes for any purpose.",
        icon: QrCode,
        color: "bg-pink-500/10 text-pink-600",
        tags: ["Generator", "Popular"],
        group: "Encoding",
        popular: true,
        keywords: ["qr", "barcode", "link"]
      },
      {
        title: "HTML Formatter",
        href: "/html-formatter",
        description: "Format and minify HTML markup.",
        icon: FileCode,
        color: "bg-orange-500/10 text-orange-600",
        tags: ["HTML", "Formatter"],
        disabled: true,
        group: "Formatting",
        keywords: ["beautify", "minify", "prettify"]
      },
      {
        title: "CSS Formatter",
        href: "/css-formatter",
        description: "Format and minify CSS stylesheets.",
        icon: Paintbrush,
        color: "bg-blue-500/10 text-blue-600",
        tags: ["CSS", "Formatter"],
        disabled: true,
        group: "Formatting",
        keywords: ["beautify", "minify", "prettify"]
      },
      {
        title: "JS Formatter",
        href: "/js-formatter",
        description: "Format and minify JavaScript code.",
        icon: Code,
        color: "bg-yellow-500/10 text-yellow-600",
        tags: ["JavaScript", "Formatter"],
        disabled: true,
        group: "Formatting",
        keywords: ["javascript", "beautify", "minify", "prettify"]
      },
      {
        title: "Markdown Editor",
        href: "/markdown-editor",
        description: "Write Markdown with a live preview.",
        icon: PenLine,
        color: "bg-slate-500/10 text-slate-600",
        tags: ["Markdown", "Editor"],
        disabled: true,
        group: "Formatting",
        keywords: ["md", "preview", "editor"]
      },
      {
        title: "JWT Decoder",
        href: "/jwt-decoder",
        description: "Decode and inspect JSON Web Tokens.",
        icon: KeyRound,
        color: "bg-red-500/10 text-red-600",
        tags: ["JWT", "Auth"],
        disabled: true,
        group: "Web & API",
        keywords: ["token", "auth", "claims", "bearer"]
      },
      {
        title: "Regex Tester",
        href: "/regex-tester",
        description: "Test and debug regular expressions live.",
        icon: Regex,
        color: "bg-emerald-500/10 text-emerald-600",
        tags: ["Regex", "Dev"],
        disabled: true,
        group: "Web & API",
        keywords: ["regexp", "pattern", "match"]
      },
      {
        title: "HTTP Status Checker",
        href: "/http-status-checker",
        description: "Look up HTTP status codes and their meanings.",
        icon: Globe,
        color: "bg-blue-500/10 text-blue-600",
        tags: ["HTTP", "Reference"],
        disabled: true,
        group: "Web & API",
        keywords: ["status code", "404", "500", "rest"]
      },
      {
        title: "User-Agent Parser",
        href: "/user-agent-parser",
        description: "Parse user-agent strings into browser, OS, and device.",
        icon: MonitorSmartphone,
        color: "bg-teal-500/10 text-teal-600",
        tags: ["HTTP", "Dev"],
        disabled: true,
        group: "Web & API",
        keywords: ["browser", "device", "os", "ua"]
      },
      {
        title: "Cron Expression Generator",
        href: "/cron-generator",
        description: "Build and explain cron schedule expressions.",
        icon: Clock,
        color: "bg-amber-500/10 text-amber-600",
        tags: ["Cron", "Scheduler"],
        disabled: true,
        group: "Time & Color",
        keywords: ["crontab", "schedule", "expression"]
      },
      {
        title: "Unix Timestamp Converter",
        href: "/timestamp-converter",
        description: "Convert Unix timestamps to dates and back.",
        icon: CalendarClock,
        color: "bg-purple-500/10 text-purple-600",
        tags: ["Time", "Converter"],
        disabled: true,
        group: "Time & Color",
        keywords: ["epoch", "date", "time", "unix"]
      },
      {
        title: "Color Converter",
        href: "/color-converter",
        description: "Convert colors between HEX, RGB, and HSL.",
        icon: Pipette,
        color: "bg-fuchsia-500/10 text-fuchsia-600",
        tags: ["Color", "Converter"],
        disabled: true,
        group: "Time & Color",
        keywords: ["hex", "rgb", "hsl", "picker"]
      }
    ]
  }
];

export const ALL_TOOLS = TOOLS_CONFIG.flatMap((category) => category.items);

export function getCategoryByHref(href: string): ToolCategory | undefined {
  return TOOLS_CONFIG.find((category) => category.href === href);
}
