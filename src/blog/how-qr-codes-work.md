---
title: "How QR Codes Work (and Why They're So Reliable)"
published: 2026-08-12
description: "From finder patterns to Reed-Solomon error correction — the clever engineering inside every QR code."
tags: ["qr-codes", "deep-dive", "technology"]
---

QR codes are so ubiquitous that we scan them without thinking — restaurant menus, payment links, Wi-Fi credentials, boarding passes. But the black-and-white squares hide some genuinely clever engineering.

## The Structure

Every QR code is a grid of black and white modules that encodes data in binary. Key regions:

- **Finder patterns** — the three large squares in the corners. They let the scanner locate the code and determine its orientation, which is why QR codes work at any angle.
- **Alignment pattern** — a smaller square in the bottom-right that corrects for perspective distortion.
- **Timing patterns** — alternating dark/light modules that establish the grid coordinates.
- **Quiet zone** — the blank margin around the code. It helps the scanner distinguish the code from its background.

## Versions and Capacity

QR codes come in 40 versions. Version 1 is a 21x21 grid; each step up adds 4 modules per side, ending at version 40 with a 177x177 grid. At the highest version with lowest error correction, a QR code can store about 4,296 alphanumeric characters or up to 7,089 digits.

Most everyday QR codes — URLs, mostly — use far less: version 3-5 is typical.

## Error Correction: The Secret Sauce

The reason a QR code still scans with a logo stamped in the middle, or after part of it is scratched or covered, is **Reed-Solomon error correction** — the same family of algorithms used in CDs and satellite communication.

There are four levels:

- **L** — recovers ~7% damage
- **M** — recovers ~15% (the common default)
- **Q** — recovers ~25%
- **H** — recovers ~30% (used when a logo will overlay the center)

Higher correction means less room for data but far more resilience. That's the trade-off you're making when you pick a level.

## Why Scanning Is So Fast

The finder patterns aren't just markers — a scanner uses them to normalize the image before decoding:

1. Locate the three finder squares
2. Correct rotation and perspective
3. Map the distorted grid back to square modules
4. Read the data and verify with error-correction checksums

All of this happens in milliseconds in modern cameras, which is why the code snaps into a link almost before you've framed it.

## Static vs Dynamic QR Codes

- **Static** — the data lives directly in the code. It works forever, needs no server, and can never expire. If it encodes a URL, that URL is what it is.
- **Dynamic** — the code encodes a short redirect URL, letting the owner change the destination. It requires a hosted service (and usually a subscription).

For anything permanent — Wi-Fi credentials, payment details, printed materials — static is the safer choice: no third-party dependency, no expiry, no tracking.

## Try It Yourself

Create a QR code for a link, text, or Wi-Fi credentials with our [QR code generator](/qr-generator) — generated entirely in your browser, no tracking, no expiry, free forever.
