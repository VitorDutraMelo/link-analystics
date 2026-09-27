import { describe, expect, it } from 'vitest';
import { registerSchema } from '../src/schemas/auth.schema.js';
import { createLinkSchema } from '../src/schemas/link.schema.js';
describe('request schemas', () => {
  it('accepts a valid registration', () =>
    expect(
      registerSchema.safeParse({
        body: { name: 'Vitor', email: 'VITOR@example.com', password: 'Backend123' },
      }).success,
    ).toBe(true));
  it('rejects weak passwords', () =>
    expect(
      registerSchema.safeParse({
        body: { name: 'Vitor', email: 'v@example.com', password: 'password' },
      }).success,
    ).toBe(false));
  it('accepts HTTPS URLs', () =>
    expect(createLinkSchema.safeParse({ body: { url: 'https://example.com/page' } }).success).toBe(
      true,
    ));
  it.each(['not-a-url', 'ftp://example.com'])('rejects invalid URL %s', (url) =>
    expect(createLinkSchema.safeParse({ body: { url } }).success).toBe(false),
  );
});
