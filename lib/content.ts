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

export const content = {
  // ---- Links (PLACEHOLDERS — replace before launch) ----
  checkoutUrl: 'https://checkout.exemplo.com/tedtech', // TODO: link real do checkout
  whatsappUrl: 'https://wa.me/5500000000000', // TODO: número real

  hero: {
    headlineWords: ['Hardware', 'Montagem', 'Manutenção'],
    subLines: [
      'Conheça os componentes, monte seu computador, instale o sistema',
      'e aprenda a diagnosticar e prevenir os problemas mais comuns.',
    ],
    cta: 'Quero me inscrever',
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
    turn: 'A boa notícia: tudo isso se aprende — começando do zero.',
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
    title: 'Dos fundamentos ao cuidado completo',
    gaugeValue: '6',
    gaugeCaption: 'módulos de aprendizado',
    steps: [
      { k: 'Fundamentos', t: 'Entenda o computador', s: 'História, hardware e software' },
      { k: 'Montagem', t: 'Monte e configure', s: 'Componentes, cabos, BIOS/UEFI e sistema' },
      { k: 'Manutenção', t: 'Diagnostique e cuide', s: 'Limpeza, segurança, backup e drivers' },
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

  tiraDuvidas: {
    label: 'Tira-dúvidas',
    title: 'Converse com a gente antes de decidir',
    chatTitle: 'TedTech · Atendimento',
    chatStatus: 'online',
    bubbles: [
      { from: 'them', text: 'Oi! Posso te ajudar a escolher? 👋' },
      { from: 'me', text: 'Sou iniciante total, consigo acompanhar?' },
      { from: 'them', text: 'Com certeza — o curso começa pelos fundamentos e avança até a manutenção.' },
    ],
    inputPlaceholder: 'Digite sua dúvida…',
    cta: 'Continuar no WhatsApp',
  },

  offer: {
    label: 'A oferta',
    title: 'Comece hoje, do zero',
    includesTitle: 'Tudo que você aprende',
    includes: [
      '6 módulos completos',
      'Fundamentos de hardware e software',
      'Componentes e montagem passo a passo',
      'BIOS/UEFI e instalação de sistemas',
      'Manutenção e diagnóstico de problemas',
      'Segurança, backup, softwares e drivers',
    ],
    priceFrom: 'De R$ 497', // TODO
    priceNow: 'R$ 297', // TODO
    installments: 'ou 12x de R$ 29,70', // TODO
    cta: 'Inscrever →',
    payments: 'Pix · Cartão · Boleto',
  },

  ctaFinal: {
    title: 'Pronto pra começar do zero?',
    sub: 'Dê o primeiro passo para conhecer, montar e cuidar do seu computador.',
    cta: 'Quero me inscrever',
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
      { label: 'YouTube', href: '#' },
    ],
  },
} as const;
