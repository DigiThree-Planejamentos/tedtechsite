import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { IBM_Plex_Sans, Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tedtech.com.br'), // TODO: domínio final
  title: 'TedTech — Curso de Manutenção e Montagem de PC do Zero',
  description:
    'Aprenda os fundamentos, a montagem, a configuração e a manutenção de computadores do zero.',
  openGraph: {
    title: 'TedTech — Curso de Manutenção e Montagem de PC',
    description:
      'Seis módulos sobre componentes, montagem, sistemas, manutenção, segurança, backup e drivers.',
    type: 'website',
    locale: 'pt_BR',
    images: ['/og.jpg'], // TODO: criar imagem OG
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${ibmPlexSans.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}
    >
      <body className={inter.className}>{children}</body>
    </html>
  );
}
