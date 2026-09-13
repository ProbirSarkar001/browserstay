---
title: "The Anatomy of a Strong Password"
published: 2026-08-20
description: "What actually makes a password strong — entropy, length, and why complexity rules matter less than you think."
tags: ["security", "passwords", "privacy"]
---

Most people believe strong passwords mean adding exclamation marks and swapping letters for numbers. The reality is both simpler and more interesting: strength comes down to one thing — randomness.

## What Attackers Actually Do

Forget the Hollywood image of a hacker guessing your password one letter at a time. Real attacks are automated:

- **Credential stuffing** — trying passwords leaked from other breaches (the most common attack)
- **Dictionary attacks** — testing millions of common passwords and variations, like `P@ssw0rd123`
- **Brute force** — trying every combination, only practical for short or weak passwords

Modern cracking tools test billions of passwords per second against stolen hashes. A "clever" human-made password follows patterns, and patterns are exactly what these tools search for.

## Entropy Is the Only Real Measure

Password strength is measured in **entropy** — the number of bits of randomness it contains. Each bit doubles the search space:

- A random 8-character password from all printable characters: ~52 bits
- A random 12-character password: ~78 bits
- A random 16-character password: ~104 bits

The key word is *random*. `Tr0ub4dor&3` feels random but follows predictable substitution patterns, so its real entropy is far lower than its length suggests.

## Length Beats Complexity

A famous xkcd comic illustrated this well. Compare:

- `Tr0ub4dor&3` — 11 characters, pattern-based, maybe ~28 bits of real entropy
- Four random common words like `correct horse battery staple` — 28 characters, ~44 bits from word choice alone

Random words are easy for humans to remember and hard for machines to guess. The randomness must come from a generator, though — your favorite phrase is not random.

## The Real Rules That Matter

1. **Never reuse passwords.** A breach at one site exposes every account using the same password.
2. **Use a password manager.** It generates and remembers truly random passwords for you.
3. **Enable two-factor authentication.** Even a stolen password becomes far less useful.
4. **Length first.** When in doubt, go longer, not more "complex."
5. **Check breach databases.** Services like Have I Been Pwned tell you if your credentials have leaked.

## Generating Passwords Safely

Any password generator that runs on a server sees your password. A browser-based generator uses your device's cryptographically secure random source (the Web Crypto API) and never transmits the result — the password exists only on your screen.

## Try It Yourself

Generate a strong, random password right in your browser with our [password generator](/password-generator) — built on the Web Crypto API, fully offline, nothing ever sent anywhere.
