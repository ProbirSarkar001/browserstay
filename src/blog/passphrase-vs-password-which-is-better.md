---
title: "Passphrase vs Password: Which Is Actually Stronger?"
published: 2026-09-25
description: "Random characters or random words? Both can be secure — but one is easier to remember and harder for machines to crack."
tags: ["security", "passwords", "privacy"]
---

You've heard both recommendations: "Use 16 random characters with symbols" and "Use four random words." They seem contradictory. Which one is actually better?

The answer depends on what you mean by "better" — and on whether the randomness is real.

## What a Password Is

Traditionally, a password is a string of characters drawn from a character set: uppercase, lowercase, numbers, symbols. Strength comes from length and randomness.

A 16-character password using all character types has roughly 104 bits of entropy if truly random. That's very strong.

The problem: humans aren't random. `P@ssw0rd!2024` checks the complexity boxes but follows patterns cracking tools know well.

## What a Passphrase Is

A passphrase is a sequence of words — ideally random words, not a sentence you composed.

`correct horse battery staple` is the famous example: four common words, high entropy, memorable.

Modern guidance from NIST and security researchers increasingly favors passphrases for human-memorized secrets because:

- **Longer** — more characters mean more entropy
- **Easier to remember** — words stick better than `k7#mQ9!xR2@pL4`
- **Easier to type** — fewer special characters to hunt on the keyboard
- **Harder to crack** — word lists for passphrases are larger than pattern-based password guesses

## The Entropy Math (Simplified)

**Random 4-word passphrase** from a 7,776-word list (like Diceware): ~51 bits
**Random 6-word passphrase** from the same list: ~77 bits
**Random 12-character password** from 94 printable characters: ~78 bits
**Random 16-character password** from 94 printable characters: ~104 bits

A 6-word passphrase rivals a 12-character random password. An 8-word passphrase exceeds most password requirements comfortably.

## When Passphrases Win

- **Master password for a password manager** — you type it daily, so memorability matters
- **Encryption keys you must recall** — disk encryption, archive passwords
- **Shared family or team secrets** — easier to communicate verbally

## When Random Character Passwords Win

- **Individual account passwords** — let a password manager generate and store random 20+ character strings. You don't need to memorize them.
- **API keys and tokens** — not meant for human memory
- **Systems with character-set requirements** — some sites reject spaces or limit length

For most accounts, the best password is one you **don't** memorize — a random string stored in a password manager.

## Common Passphrase Mistakes

**Using a real sentence:** "My dog's name is Max and he is 7" — predictable, low entropy.

**Using song lyrics or quotes:** Attackers test these.

**Using personal information:** Birthdays, pet names, street names — all guessable.

**Too few words:** Three words from common lists may be crackable with dedicated hardware.

Passphrases must be **randomly generated**, not creatively composed.

## Passphrases and Server-Side Generators

If you generate a passphrase on a website, that server potentially logs it. For a master password or encryption key, use a generator that runs locally in your browser — Web Crypto API, no transmission.

## The Practical Recommendation

1. **Password manager** for all individual accounts — random 16–20 character passwords
2. **Random passphrase** (6+ words) for your password manager's master password
3. **Two-factor authentication** everywhere it's offered
4. **Never reuse** passwords across sites

You don't need to choose one approach for everything. Use the right tool for each situation.

## Try It Yourself

Generate random passwords or passphrases with our [Password Generator](/password-generator) — cryptographically secure, runs entirely in your browser, nothing stored or sent. Read more about [what makes a password strong](/blog/anatomy-of-a-strong-password).
