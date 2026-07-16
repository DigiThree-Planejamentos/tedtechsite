import type { ComponentType, SVGProps } from 'react';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { Reveal } from '@/components/motion/Reveal';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { content } from '@/lib/content';

type PathIconProps = SVGProps<SVGSVGElement>;
type PathIconName = (typeof content.caminhos.cards)[number]['icon'];

function HomeIcon(props: PathIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      {...props}
    >
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v11h14V9" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

function MoneyIcon(props: PathIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5c-.7-.7-1.8-1-3-1-1.7 0-3 .9-3 2.2 0 3.5 6 1.6 6 5 0 1.4-1.4 2.3-3.2 2.3-1.3 0-2.6-.4-3.5-1.3" />
      <path d="M12 5.5v13" />
    </svg>
  );
}

function BriefcaseIcon(props: PathIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      {...props}
    >
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12.5c5.6 2.3 12.4 2.3 18 0" />
      <path d="M10 13h4" />
    </svg>
  );
}

const pathIcons: Record<PathIconName, ComponentType<PathIconProps>> = {
  home: HomeIcon,
  money: MoneyIcon,
  briefcase: BriefcaseIcon,
};

export function Caminhos() {
  const c = content.caminhos;

  return (
    <section
      id="caminhos"
      className="site-section section-divider scroll-mt-24"
    >
      <div className="mx-auto w-full max-w-content text-center">
        <SectionLabel>{c.label}</SectionLabel>
        <SplitReveal
          as="h2"
          className="mt-3 text-2xl font-extrabold tracking-tight md:text-4xl"
        >
          {c.title}
        </SplitReveal>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#526071] md:text-[15px]">
          {c.subtitle}
        </p>

        <Reveal
          stagger={0.12}
          className="mt-10 grid gap-4 md:grid-cols-3 lg:gap-6"
        >
          {c.cards.map((card) => {
            const Icon = pathIcons[card.icon];

            return (
              <article
                key={card.title}
                className="site-panel flex h-full flex-col rounded-[1.5rem] p-6 text-left md:p-8"
              >
                <Icon
                  aria-hidden="true"
                  className="h-8 w-8 text-blue"
                />
                <h3 className="mt-5 text-lg font-bold md:text-xl">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#526071]">
                  {card.desc}
                </p>
                <ul className="mt-5 space-y-3">
                  {card.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-3 text-sm md:text-[15px]"
                    >
                      <span className="text-blue" aria-hidden>
                        ✓
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </Reveal>

        <div className="mt-8 flex justify-center">
          <MagneticButton>
            <Button href={content.checkoutUrl} variant="primary">
              {c.cta}
            </Button>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
