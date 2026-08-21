import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/sections/Header';
import { content } from '@/lib/content';
import { site } from '@/lib/site';

describe('Header', () => {
  it('renders one button per section, in page order, plus the CTA to checkout', () => {
    render(<Header />);
    const nav = screen.getByRole('navigation', { name: 'Seções da página' });
    const links = Array.from(nav.querySelectorAll('a'));

    // A ORDEM e o conteudo do teste, nao um detalhe: o header so aparece
    // enquanto o hero esta na tela, entao esta barra e o indice que o
    // visitante le ao chegar. Um indice fora da ordem da rolagem manda ele
    // pra tras sem avisar.
    expect(links).toHaveLength(site.nav.length);
    expect(links.map((a) => a.textContent)).toEqual(site.nav.map((i) => i.label));
    expect(links.map((a) => a.getAttribute('href'))).toEqual(site.nav.map((i) => i.href));

    // Nenhum destino repetido. Era exatamente o caso de "Dúvidas", que
    // apontava pro mesmo #oferta do preco enquanto o FAQ nao tinha secao
    // propria: dois botoes gastando largura da barra pra levar ao mesmo
    // lugar. A barra e curta demais pra pagar esse preco duas vezes.
    expect(new Set(site.nav.map((i) => i.href)).size).toBe(site.nav.length);

    expect(screen.queryByText('Quem ensina')).not.toBeInTheDocument();
  });

  it('keeps the checkout CTA out of the section nav', () => {
    render(<Header />);
    const nav = screen.getByRole('navigation', { name: 'Seções da página' });
    const cta = screen.getByRole('link', { name: content.hero.cta });

    expect(cta).toHaveAttribute('href', content.checkoutUrl);
    // O CTA sai da pagina; os outros rolam dentro dela. Se ele cair dentro do
    // <nav>, um leitor de tela passa a anuncia-lo como mais uma secao — e o
    // teste de ordem acima quebraria por um motivo que nao e o dele.
    expect(nav.contains(cta)).toBe(false);
  });
});
