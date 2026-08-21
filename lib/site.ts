export const site = {
  name: 'TedTech',
  // Indice da pagina, na ordem em que as secoes aparecem na tela. O header
  // monta os botoes a partir daqui, entao tornar uma secao navegavel e uma
  // linha so — e page.test confirma que todo href aponta pra um id que existe
  // de verdade, porque renomear uma secao quebra a navegacao em silencio.
  //
  // Rotulos curtos de proposito: os cinco vivem numa unica linha entre o logo
  // e o botao de compra, e o header nao tem pra onde crescer.
  //
  // Fora da lista, os dois casos deliberados:
  //  - #hero e o topo da pagina, nao um destino;
  //  - o fechamento nao tem id (page.test exige `oferta` como ultima
  //    section[id]) e repete o CTA que ja esta no botao ao lado.
  nav: [
    { label: 'O problema', href: '#dores' },
    { label: 'Módulos', href: '#modulos' },
    { label: 'Evolução', href: '#evolucao' },
    { label: 'Caminhos', href: '#caminhos' },
    // Este item se chamava "Dúvidas" enquanto o FAQ nao tinha secao propria.
    // Agora o nome acompanha o rotulo que o visitante ve ao chegar ("A
    // oferta") — nav que mente sobre o destino desorienta. As duvidas
    // continuam la, no card da direita: NAO criar um segundo item apontando
    // pro mesmo #oferta.
    { label: 'Oferta', href: '#oferta' },
  ],
} as const;
