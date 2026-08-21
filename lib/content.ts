export interface Module {
  n: string;
  icon: string;
  image: string;
  imageAlt: string;
  title: string;
  desc: string;
  lessons: string[];
}

export interface Stat {
  value: string;
  label: string;
}

/**
 * Um par da secao de oferta. `leva` e a linha do card da esquerda,
 * `duvida` e a mesma linha vista do lado do aluno, e `resposta` abre no
 * acordeao. A ORDEM do array e a ligacao entre os dois cards: mexer num
 * lado sem mexer no outro desalinha o par.
 */
export interface OfferPair {
  leva: string;
  duvida: string;
  resposta: string;
}

export const content = {
  // ---- Links (PLACEHOLDERS — replace before launch) ----
  checkoutUrl: 'https://checkout.exemplo.com/tedtech', // TODO: link real do checkout
  whatsappUrl: 'https://wa.me/5500000000000', // TODO: número real

  hero: {
    eyebrow: 'Curso de montagem e manutenção de computadores',
    // Duas partes tipográficas de uma frase só, cada uma em sua própria linha.
    // O h1 continua lendo as duas partes como uma única frase.
    headline: {
      lead: 'Chega',
      rest: 'de pagar técnico',
    },
    sub: 'Sem pré-requisito e sem medo de abrir o gabinete.',
    bullets: [
      '6 módulos, dos componentes à manutenção',
      'Do zero — nenhum conhecimento prévio',
      'Pra cuidar do seu PC ou atender clientes',
    ],
    cta: 'Quero aprender',
  },

  dores: {
    label: 'Você se identifica?',
    title: 'Já pensou alguma dessas?',
    thoughts: [
      { q: 'Será que é vírus ou hora de formatar?', s: '— e o PC só fica mais lento' },
      { q: 'Tenho medo de abrir e quebrar algo.', s: '— aí nunca aprende de verdade' },
      { q: 'De novo pagando técnico por isso?', s: '— por um problema bem simples' },
      { q: 'Como descubro qual componente está com problema?', s: '— sem trocar peças no escuro' },
    ],
    turn: 'A boa notícia: tudo isso se aprende começando do zero.',
  },

  modulos: {
    label: 'O que você vai aprender',
    title: '6 módulos, dos fundamentos à manutenção',
  },

  modules: [
    {
      n: '01',
      icon: '🧠',
      image: '/modulo-1.png',
      imageAlt: 'Tela do computador exibindo uma falha durante a instalação de um programa',
      title: 'Fundamentos dos computadores',
      desc: 'Entenda a evolução dos computadores e a relação entre hardware e software.',
      lessons: [
        'História e evolução dos computadores',
        'Gerações e principais marcos tecnológicos',
        'Componentes básicos de um computador',
        'Diferenças e relação entre hardware e software',
      ],
    },
    {
      n: '02',
      icon: '🧩',
      image: '/modulo-2.png',
      imageAlt: 'Placa-mãe, processador, teclado e ferramentas sobre uma bancada',
      title: 'Componentes de um computador',
      desc: 'Conheça as peças, suas funções, tipos e critérios de compatibilidade.',
      lessons: [
        'Placa-mãe, conectores e slots',
        'Processadores e critérios de escolha',
        'Memória RAM e dispositivos de armazenamento',
        'Placas de vídeo e fontes de alimentação',
        'Formatação e particionamento de discos',
      ],
    },
    {
      n: '03',
      icon: '🔧',
      image: '/modulo-3.png',
      imageAlt: 'Gabinete aberto com placa-mãe, fonte e cabos instalados',
      title: 'Montagem de computadores',
      desc: 'Prepare as ferramentas, instale os componentes e faça a primeira inicialização.',
      lessons: [
        'Ferramentas e segurança durante a montagem',
        'Montagem dos componentes passo a passo',
        'Conexão dos cabos e verificação final',
        'Configuração inicial da BIOS/UEFI',
        'Instalação do sistema operacional e drivers',
      ],
    },
    {
      n: '04',
      icon: '🛠️',
      image: '/modulo-4.png',
      imageAlt: 'Fonte, placa-mãe e componentes preparados para manutenção',
      title: 'Manutenção de computadores',
      desc: 'Realize limpeza preventiva, diagnostique falhas e atualize componentes.',
      lessons: [
        'Limpeza externa e interna',
        'Programação da manutenção preventiva',
        'Diagnóstico de problemas comuns',
        'Ferramentas de diagnóstico',
        'Compatibilidade e atualização de componentes',
      ],
    },
    {
      n: '05',
      icon: '🛡️',
      image: '/modulo-5.png',
      imageAlt: 'Monitor exibindo o processo de instalação do Windows',
      title: 'Segurança e backup',
      desc: 'Proteja o equipamento e os dados contra danos, falhas e ameaças.',
      lessons: [
        'Segurança física e elétrica',
        'Proteção contra malware e acessos indevidos',
        'Boas práticas de segurança de dados',
        'Backup local e em nuvem',
        'Ferramentas de backup e recuperação de dados',
      ],
    },
    {
      n: '06',
      icon: '💻',
      image: '/modulo-6.png',
      imageAlt: 'Monitor com navegador e aplicativos abertos no Windows',
      title: 'Softwares e drivers',
      desc: 'Instale sistemas e utilitários e mantenha drivers e firmware atualizados.',
      lessons: [
        'Instalação de Windows e Linux',
        'Identificação e instalação de drivers',
        'Softwares essenciais e utilitários',
        'Atualização de drivers',
        'Atualização de firmware e BIOS/UEFI',
      ],
    },
  ] as Module[],

  evolucao: {
    label: 'Sua evolução',
    title: 'Dos fundamentos ao primeiro cliente',
    gaugeValue: '6',
    gaugeCaption: 'módulos de aprendizado',
    steps: [
      { k: 'Fundamentos', t: 'Entenda o computador', s: 'História, hardware e software' },
      { k: 'Montagem', t: 'Monte e configure', s: 'Componentes, cabos, BIOS/UEFI e sistema' },
      { k: 'Manutenção', t: 'Diagnostique e cuide', s: 'Limpeza, segurança, backup e drivers' },
      // A novidade do produto: o curso nao termina no conserto. O anel
      // continua dizendo "6 modulos" — a ajuda do Ted e alem dos modulos,
      // nao um setimo.
      { k: 'Venda', t: 'Comece a ganhar', s: 'O Ted te ajuda a oferecer, cobrar e fechar os primeiros clientes' },
    ],
  },

  caminhos: {
    label: 'Para que serve esse conhecimento',
    title: 'Um curso, três caminhos',
    subtitle:
      'O que você aprende nos 6 módulos serve tanto pra cuidar do seu próprio computador quanto pra ganhar dinheiro com isso — na hora vaga ou como profissão.',
    cta: 'Quero aprender',
    cards: [
      {
        icon: 'home',
        title: 'No seu próprio PC',
        desc: 'Resolva os problemas de casa sem pagar técnico toda vez.',
        bullets: [
          'Diagnosticar lentidão e travamentos',
          'Fazer upgrade com segurança',
          'Manter backup e proteção em dia',
        ],
      },
      {
        icon: 'money',
        title: 'Como renda extra',
        desc: 'Atenda vizinhos, amigos e pequenos negócios nas horas vagas.',
        bullets: [
          'Montagens e formatações avulsas',
          'Manutenção pra quem está por perto',
          // Primeira pessoa de proposito: e o Ted falando — decisao do cliente.
          'No final te ajudo a conseguir seus primeiros clientes',
        ],
      },
      {
        icon: 'briefcase',
        title: 'Como profissão',
        desc: 'Use a base do curso pra entrar no mercado de suporte técnico.',
        bullets: [
          'Assistências técnicas e lojas de informática',
          'Suporte de TI dentro de empresas',
          'Montar seu próprio negócio de manutenção',
        ],
      },
    ],
  },

  instrutor: {
    label: 'Quem ensina',
    name: 'Nome do Instrutor', // TODO
    role: 'Técnico em manutenção · X anos de experiência', // TODO
    bio: 'Apaixonado por computadores, já formou centenas de alunos do absoluto zero. Aqui ele ensina exatamente o passo a passo que usa no dia a dia.', // TODO
    heroQuote:
      '“[X] anos de mercado, formado em [certificação]. Separei tudo que aprendi nesse tempo nesse curso, direto ao ponto, pra você aprender a consertar de verdade.”', // TODO: dados reais
    stats: [
      { value: 'X anos', label: 'de experiência' },
      { value: '+XXX', label: 'PCs montados' },
      { value: '+XXXX', label: 'alunos/clientes' },
    ] as Stat[],
    videoPoster: '/instrutor-poster.jpg', // TODO
    videoSrc: '', // TODO: embed/mp4
  },

  offer: {
    label: 'A oferta',
    title: 'Comece hoje, do zero',
    includesTitle: 'O que você leva',
    doubtsTitle: 'Antes de você decidir',
    priceFrom: 'De R$ 497', // TODO
    priceNow: 'R$ 297', // TODO
    installments: 'ou 12x de R$ 29,70', // TODO
    cta: 'Quero aprender',
    payments: 'Pix · Cartão · Boleto',
    askHint: 'Ficou outra dúvida?',
    askCta: 'Quero conhecer mais',

    // Os oito pares. A ordem E a ligacao entre os dois cards: a linha i da
    // esquerda e a duvida i da direita sao o mesmo assunto visto de dois
    // lados. Mexer na ordem de um lado sem mexer no outro quebra o par.
    //
    // As respostas se apoiam so no que ja esta neste arquivo — os seis
    // modulos e suas licoes. Nenhuma promete prazo de acesso, certificado
    // ou acompanhamento, que continuam sendo decisoes em aberto do cliente —
    // exceto o par "Ajuda de quem entende para comecar a vender", que ja
    // promete esse acompanhamento; falta so definir o formato dele, o que
    // precisa ser resolvido antes do lancamento.
    // A duvida 2 e a 8 usam o texto que o cliente ja tinha escrito.
    pairs: [
      {
        leva: '6 módulos completos',
        duvida: 'São seis módulos… eu vou dar conta?',
        resposta:
          'Eles vêm em ordem, e cada um só supõe o anterior: fundamentos, componentes, montagem, manutenção, segurança e backup, softwares e drivers. O primeiro começa explicando o que é cada peça — não há degrau escondido no meio do caminho.',
      },
      {
        leva: 'Fundamentos de hardware e software',
        duvida: 'Nunca abri um computador na vida. Serve pra mim?',
        resposta:
          'Serve. O módulo 01 começa pelos fundamentos — o que é cada componente e como hardware e software se relacionam — antes de qualquer montagem. Não é preciso conhecimento prévio.',
      },
      {
        leva: 'Componentes e montagem passo a passo',
        duvida: 'Tenho medo de montar e queimar alguma peça.',
        resposta:
          'A primeira aula do módulo 03 é justamente ferramentas e segurança durante a montagem, antes de encostar em qualquer componente. Depois vêm as peças uma a uma, a conexão dos cabos e uma verificação final antes de ligar.',
      },
      {
        leva: 'BIOS/UEFI e instalação de sistemas',
        duvida: 'BIOS, UEFI… isso não é coisa de técnico avançado?',
        resposta:
          'Entra no módulo 03, logo depois da montagem: primeiro a configuração inicial da BIOS/UEFI, depois a instalação do sistema operacional e dos drivers. Na ordem certa, deixa de ser mistério.',
      },
      {
        leva: 'Manutenção e diagnóstico de problemas',
        duvida: 'E quando der problema, vou saber achar o que é?',
        resposta:
          'É o módulo 04 inteiro: limpeza interna e externa, quando fazer a preventiva, diagnóstico dos problemas comuns e as ferramentas de diagnóstico. A ideia é você trocar peça sabendo qual, não no escuro.',
      },
      {
        leva: 'Segurança, backup, softwares e drivers',
        duvida: 'Depois que eu arrumar, como não perco tudo de novo?',
        resposta:
          'Os módulos 05 e 06 fecham essa ponta: proteção contra malware e acessos indevidos, boas práticas com os dados, backup local e em nuvem, e como manter drivers e firmware atualizados.',
      },
      {
        // A novidade do produto (2026-08-20): no final do curso o Ted ajuda
        // o aluno a vender. "definir o preço", nunca "precificar" — o
        // content.test proibe a palavra.
        leva: 'Ajuda de quem entende para começar a vender',
        duvida: 'Aprendi. E como eu consigo meus primeiros clientes?',
        resposta:
          'Essa é a última etapa do curso: o Ted te ajuda a oferecer seus serviços, definir o preço e fechar os primeiros clientes — pra transformar o que você aprendeu em renda.',
      },
      {
        leva: 'Garantia de 7 dias',
        duvida: 'E se eu comprar e não for pra mim?',
        resposta:
          'Você tem 7 dias a partir da compra pra pedir o reembolso integral, sem precisar justificar. É o direito de arrependimento previsto no art. 49 do Código de Defesa do Consumidor.',
      },
    ] as OfferPair[],
  },

  // Secao de fechamento: a ultima faixa, branca pura, que o rodape
  // continua. Repete a promessa nova do produto como ultimo argumento
  // antes do CTA final.
  fechamento: {
    // Nao usar "comece"/"agora" aqui: o titulo abaixo ja abre com "Agora",
    // e os dois a dois centimetros de distancia batiam na mesma tecla.
    // "A virada" nomeia o que a secao faz em vez de competir com ele.
    label: 'A virada',
    // Fecha o arco do hero: a pagina abre com "Chega de pagar tecnico" e
    // termina dizendo que o tecnico agora e o leitor. Evita de proposito a
    // formula "de X ao Y" e a ponta "primeiro cliente", que ja estao no
    // titulo da Evolucao — dois titulos iguais em estrutura e destino, a uma
    // secao de distancia, liam como repeticao.
    title: 'Agora o técnico é você',
    // O titulo faz uma afirmacao de identidade; o subtitulo existe pra
    // torna-la crivel. Nao repete "seis modulos", que a pagina ja disse tres
    // vezes — pega a virada do dinheiro, que e o arco do hero fechando.
    //
    // A ajuda do Ted saiu daqui e virou bloco proprio (destaque, abaixo):
    // como segunda frase de um paragrafo ela passava batida, e e ela que o
    // cliente quer usar pra vender.
    sub: 'O mesmo problema que te custava dinheiro passa a render.',
    // PRECO DE SERVICO, NAO RENDA MENSAL — a distincao e deliberada e nao
    // deve ser desfeita. "Uma formatacao custa R$ 100 a 200" e preco de
    // mercado, fato verificavel. "Voce vai ganhar R$ X por mes" seria
    // promessa sobre o resultado futuro do comprador, e publicidade vincula
    // pelo CDC. A pesquisa (2026) nao achou media mensal confiavel para
    // autonomo: as fontes so publicam preco por servico, e converter em
    // "por mes" exigiria arbitrar um volume de atendimentos.
    //
    // Os tres servicos abaixo saem dos modulos 03 e 04, entao a pagina
    // ensina o que precifica. Mexer aqui pede rever a nota logo abaixo.
    // Titulo do card da esquerda. "Se cobra", impessoal, nao "voce cobra":
    // mantem a tabela no terreno de preco de mercado em vez de virar
    // projecao do que o leitor vai ganhar.
    precosTitulo: 'Quanto se cobra por serviço',
    precos: [
      { servico: 'Formatação com instalação do Windows', valor: 'R$ 100 a R$ 200' },
      { servico: 'Remoção de vírus e otimização', valor: 'R$ 150 a R$ 300' },
      { servico: 'Troca de SSD com migração de dados', valor: 'R$ 200 a R$ 450' },
    ],
    // A nota nao e enfeite: e ela que mantem os numeros no terreno de "preco
    // praticado" em vez de "quanto voce vai ganhar".
    precosNota:
      'Faixas médias praticadas no mercado brasileiro em 2026. Quanto você cobra depende da sua região, do serviço e da sua experiência.',
    // O DIFERENCIAL DO PRODUTO, em bloco proprio logo antes do botao — e o
    // argumento que o cliente quer usar pra vender, entao nao pode viver
    // como segunda frase de um paragrafo.
    //
    // ATENCAO ao mexer: esta e a unica promessa da pagina cujo FORMATO ainda
    // nao esta definido (nao diz se e aula, mentoria, grupo ou material). As
    // outras se ancoram num modulo numerado. Publicidade vincula pelo CDC, e
    // dar destaque aumenta a exposicao — por isso o texto fala do QUE o Ted
    // ajuda a fazer, sem prometer formato, prazo ou resultado. Quando o
    // cliente definir o formato, nomear aqui.
    destaqueLabel: 'Você não começa sozinho',
    destaque:
      'No final do curso, o Ted te ajuda a dar os primeiros passos como técnico:',
    // Os quatro itens saem do video institucional do hero: o instrutor os
    // diz com essas palavras. Repetir as MESMAS quatro aqui faz a pagina
    // confirmar o que o visitante acabou de ouvir, em vez de parafrasear —
    // e enche a coluna direita, que antes terminava muito antes da tabela
    // de precos ao lado.
    //
    // Cada item nomeia o que se APRENDE A FAZER, nunca um resultado
    // prometido: "prospectar clientes" e ensino; "voce vai ter clientes"
    // seria promessa sobre o futuro do comprador. E a mesma linha que
    // segura os precos no terreno de mercado, pelo mesmo motivo (CDC).
    destaqueItens: [
      'Cobrar o valor certo pelo serviço',
      'Atender bem o cliente',
      'Prospectar clientes na sua região',
      'Conseguir as primeiras ordens de serviço',
    ],
    // "Quero aprender" aparece em todos os outros CTAs da pagina. Aqui, logo
    // depois de "agora o tecnico e voce", aprender soa como recuo: a essa
    // altura o leitor ja foi convencido de que vai saber.
    cta: 'Quero começar',
  },

  // A secao de FAQ separada deixou de existir: as duvidas viraram o card
  // direito da oferta, pareadas com o que o curso entrega. Cinco perguntas
  // antigas sairam junto por estarem sem resposta ate hoje e por nao terem
  // par do lado da oferta — ferramentas, prazo de acesso, certificado,
  // acompanhamento e celular. Voltam quando o cliente decidir as respostas.

  floatingCta: {
    urgency: 'Últimas vagas com acompanhamento',
    cta: 'Quero aprender',
  },

  footer: {
    tagline: 'Curso de manutenção e montagem de PC, do zero.',
    cnpj: 'CNPJ 00.000.000/0000-00', // TODO
    email: 'contato@tedtech.com.br', // TODO
    phone: {
      label: '(24) 99999-9999', // TODO: número real
      href: 'tel:+5524999999999',
    },

    links: [
      { label: 'Termos', href: '#' },
      { label: 'Privacidade', href: '#' },
      { label: 'Kiwify', href: 'https://kiwify.com.br/tedtech-exemplo' }, // TODO: link real da Kiwify
    ],
    socials: [
      {
        label: 'Instagram @tedtechangra',
        href: 'https://www.instagram.com/tedtechangra/',
      },
    ],
  },
} as const;
