/**
 * A aba que marca a volta de uma faixa clara depois de uma escura.
 *
 * Com as faixas escuras transparentes — elas deixam passar o fundo do
 * site e o canvas de circuitos — a faixa clara e a unica superficie
 * solida da pagina. A aba e uma saliencia dessa superficie, pendurada
 * acima da secao (`bottom-full`) e avancando para dentro do vao escuro.
 *
 * O efeito nao vem do corpo da aba, e sim dos dois "ombros" ao lado
 * dele: cada quadradinho de 28px leva uma mascara radial que escava um
 * quarto de circulo no proprio canto superior. O resultado e um canto
 * concavo que emenda com o canto convexo do corpo, e a aba deixa de
 * parecer colada por cima para parecer que brota da faixa.
 *
 * A cor vem de var(--band-bg): a aba nao sabe de que cor e, ela herda o
 * fundo da faixa que a hospeda. Mudar o ritmo leva a aba junto, com a
 * cor certa, sem editar este arquivo.
 *
 * Medidas conferidas na referencia (Zarpei): 56px de altura, ombros de
 * 28x28, raio de 28px, corpo de min(58%, 520px). Nao muda entre desktop
 * e mobile — nenhum breakpoint e necessario.
 */
export function SectionTab() {
  return (
    <div
      aria-hidden="true"
      className="section-tab pointer-events-none absolute inset-x-0 bottom-full"
    >
      <div className="section-tab__gutter mx-auto w-full max-w-content">
        <div className="flex h-14 items-stretch">
          <span className="section-tab__shoulder section-tab__shoulder--l" />
          <span className="h-full w-[min(58%,520px)] shrink-0 rounded-t-[28px] bg-[var(--band-bg)]" />
          <span className="section-tab__shoulder section-tab__shoulder--r" />
        </div>
      </div>
    </div>
  );
}
