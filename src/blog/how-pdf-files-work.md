---
title: "How PDF Files Actually Work"
published: 2026-08-28
description: "A look inside the PDF format — objects, pages, and why merging or splitting a PDF is usually just reorganizing a container."
tags: ["pdf", "file-formats", "deep-dive"]
---

PDF is everywhere — contracts, invoices, manuals, tickets — yet most people have no idea what's inside one. Understanding the format explains why tools can merge, split, and encrypt PDFs so easily.

## PDF Is a Container, Not a Document

A PDF file is closer to a zip archive than to a word processor document. Inside, you'll find:

- **Objects** — the building blocks: text, fonts, images, vector graphics
- **Page tree** — the structure that defines page order
- **Cross-reference table** — an index telling the reader where every object lives in the file
- **Metadata** — title, author, creation date, and so on

Each page is a recipe: "draw this image here, render that text there, in this font." The content is stored as drawing instructions, not as a fixed image.

## Why PDFs Look the Same Everywhere

This is the format's superpower. A PDF embeds everything it needs:

- Fonts are embedded (or subsetted), so text renders identically on any machine
- Images are stored as self-contained streams
- Page geometry is fixed in points (1/72 of an inch), not relative units

There's no "reflow" like in HTML. What you see is what everyone sees — the reason PDF became the standard for legal documents.

## Why Merging and Splitting Is Easy

Because pages are largely independent objects in a container:

- **Merging** two PDFs means creating a new file whose page tree references pages from both documents, then copying over the referenced objects. No re-rendering involved.
- **Splitting** means building a new file that references only the pages you want, plus whatever shared resources (fonts, images) those pages need.

This is why merging a 100-page PDF takes milliseconds — the tool is shuffling pointers into a new container, not recompressing anything.

## Encryption and Permissions

PDF supports built-in encryption with two separate passwords:

- **User password** (open password) — required to open and view the document
- **Owner password** (permissions password) — controls restrictions like printing, copying text, or editing

An important quirk: a file with only an owner password can be opened by anyone, but restricts certain actions. Many "locked" PDFs are like this — and the restrictions can be lifted precisely because the content is only lightly encrypted.

## Compression Inside PDFs

Streams inside a PDF are usually compressed with the same algorithms as ZIP files (Flate/Deflate). Images may use JPEG or JPEG 2000 encoding. This means:

- A scanned PDF's size is dominated by its embedded images
- Optimizing a PDF mostly means recompressing those images
- Text itself is tiny — a dense page of text is often just a few kilobytes

## The Takeaway

Once you see PDF as a structured container of independent page objects, the common operations stop feeling magical. Merge, split, extract, rotate — they're all reorganization, and it can all happen locally in your browser.

## Try It Yourself

Need to reorganize a PDF? Our [PDF tools](/pdf-tools) — [merge](/merge-pdf), [split](/split-pdf), [encrypt](/encrypt-pdf), and [unlock](/unlock-pdf) — run entirely in your browser. No uploads, no accounts.
