---
title: "How to Password Protect a PDF"
published: 2026-09-17
description: "Add a password to sensitive PDFs before emailing or sharing — and why you should encrypt locally, not on a server."
tags: ["pdf", "security", "how-to"]
---

You're about to email a contract, financial statement, or personal document. It contains information you wouldn't post publicly. Shouldn't the PDF itself be locked?

Password protecting a PDF adds a layer of security — anyone who receives the file needs the password to open it. Here's how to do it right.

## What PDF Encryption Does

When you encrypt a PDF with a password:

- The file contents are scrambled using encryption
- Opening the PDF requires the correct password
- Without the password, the content is unreadable

This protects the file in transit (email, cloud storage, USB drives) and at rest (if someone gets the file without the password).

## User Password vs Owner Password

PDFs support two types of passwords:

- **User password (open password)** — required to open and view the document. This is what most people mean by "password protect."
- **Owner password (permissions password)** — controls whether the recipient can print, copy text, or edit. The file can be opened without it, but actions are restricted.

For sharing sensitive documents, set a **user password** so the recipient must know the secret to read anything at all.

## How to Encrypt a PDF

1. **Open your PDF** in a tool that supports encryption
2. **Choose a strong password** — random, long, not reused from other accounts
3. **Set encryption** — the tool scrambles the file contents
4. **Download the encrypted PDF** — this is the file you share
5. **Send the password separately** — ideally through a different channel (text message while emailing the file, or a phone call)

Never put the password in the same email as the encrypted file. That defeats the purpose.

## Why Encrypt Locally

Encrypting a PDF on a website means uploading the unencrypted file first. The server sees your document in plain text, then encrypts it and sends it back.

For truly sensitive files, encryption should happen on your device — before the file ever touches a network.

Browser-based PDF encryption loads your file into memory, encrypts it locally, and lets you download the protected version. The plaintext never leaves your computer.

## Password Tips

- Use at least 12 random characters
- Don't reuse passwords from other accounts
- Share passwords through a separate, secure channel
- If the recipient might forget, use a password manager to generate and share securely

## Try It Yourself

Password protect PDFs with our free [Encrypt PDF](/encrypt-pdf) tool. Set a user password, download the encrypted file. Everything runs in your browser — your document is never uploaded.
