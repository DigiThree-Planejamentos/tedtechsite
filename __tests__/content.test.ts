import { describe, it, expect } from 'vitest';
import { content } from '@/lib/content';

describe('content', () => {
  it('has exactly 6 modules with all fields filled', () => {
    expect(content.modules).toHaveLength(6);
    for (const m of content.modules) {
      expect(m.n).toMatch(/^0[1-6]$/);
      expect(m.title.length).toBeGreaterThan(0);
      expect(m.desc.length).toBeGreaterThan(0);
      expect(m.image).toMatch(/^\/modulo-[1-6]\.png$/);
      expect(m.imageAlt.length).toBeGreaterThan(0);
      expect(m.lessons.length).toBeGreaterThanOrEqual(4);
      expect(m.lessons.every((lesson) => lesson.length > 0)).toBe(true);
    }
  });

  it('exposes checkout and whatsapp links', () => {
    expect(content.checkoutUrl).toMatch(/^https?:\/\//);
    expect(content.whatsappUrl).toMatch(/^https:\/\/wa\.me\//);
  });

  it('offer has price and confirmed course content', () => {
    expect(content.offer.priceNow).toBeTruthy();
    expect(content.offer.includes.length).toBeGreaterThanOrEqual(5);
    expect(content.offer.includes).toContain('6 módulos completos');
  });

  it('does not advertise unsupported course deliverables', () => {
    const pageContent = JSON.stringify(content).toLowerCase();
    expect(pageContent).not.toContain('dual boot');
    expect(pageContent).not.toContain('precificar');
    expect(pageContent).not.toContain('acesso vitalício');
    expect(pageContent).not.toContain('certificado de conclusão');
  });
});
