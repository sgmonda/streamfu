# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.6.x   | :white_check_mark: |
| < 0.6   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in streamfu, please report it responsibly.

**Do not open a public issue.** Instead, send an email to **sgmonda@gmail.com** with:

- A description of the vulnerability
- Steps to reproduce it
- The affected version(s)
- Any potential impact assessment

You should expect an initial response within **72 hours**. Once confirmed, a fix will be prioritized and released as a patch version.

## Scope

streamfu is a stream utility library that processes data in-memory. Relevant security concerns include:

- Denial of service through unbounded stream processing
- Prototype pollution via stream chunks
- Unexpected behavior in error propagation that could mask failures
