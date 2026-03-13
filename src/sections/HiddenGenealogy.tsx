import { useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { timelineEvents } from '@/data';
import type { TimelineCategory } from '@/data';
import Section from '@/components/Layout/Section';
import SectionHeading from '@/components/Layout/SectionHeading';

/* ------------------------------------------------------------------ */
/*  Category metadata                                                  */
/* ------------------------------------------------------------------ */

const categoryMeta: Record<
  TimelineCategory,
  { label: string; colorClass: string; dotColor: string; borderColor: string }
> = {
  movement: {
    label: '市民運動',
    colorClass: 'bg-movement/20 text-movement',
    dotColor: 'bg-movement',
    borderColor: 'border-movement',
  },
  policy_change: {
    label: '政策',
    colorClass: 'bg-policy/20 text-policy',
    dotColor: 'bg-policy',
    borderColor: 'border-policy',
  },
  organization_event: {
    label: '組織',
    colorClass: 'bg-org-event/20 text-org-event',
    dotColor: 'bg-org-event',
    borderColor: 'border-org-event',
  },
  social_context: {
    label: '社会背景',
    colorClass: 'bg-social/20 text-social',
    dotColor: 'bg-social',
    borderColor: 'border-social',
  },
};

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const cardLeftVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const cardRightVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const cardMobileVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

/* ------------------------------------------------------------------ */
/*  Founding event detection                                           */
/* ------------------------------------------------------------------ */

const FOUNDING_EVENT = '東京CPB設立総会';

/* ------------------------------------------------------------------ */
/*  Central animated line                                              */
/* ------------------------------------------------------------------ */

function TimelineLine() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const scaleY = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <div ref={ref} className="absolute inset-y-0 left-4 md:left-1/2 w-0.5">
      <motion.div
        className="h-full w-full origin-top bg-accent/20"
        style={{ scaleY }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Timeline card                                                      */
/* ------------------------------------------------------------------ */

interface TimelineCardProps {
  year: number;
  month?: number;
  eventJa: string;
  category: TimelineCategory;
  entities: string[];
  index: number;
  isFounding: boolean;
}

function TimelineCard({
  year,
  month,
  eventJa,
  category,
  entities,
  index,
  isFounding,
}: TimelineCardProps) {
  const meta = categoryMeta[category];
  const isLeft = index % 2 === 0;

  const dateStr = month ? `${year}.${String(month).padStart(2, '0')}` : `${year}`;

  const card = (
    <div
      className={`
        rounded-lg px-5 py-4
        ${isFounding
          ? 'border-l-[3px] border-accent bg-accent/[0.08] shadow-[0_0_24px_-6px_rgba(201,169,110,0.15)]'
          : `border-l-2 ${meta.borderColor} bg-bg-secondary`
        }
      `}
    >
      {/* Year */}
      <span
        className={`block font-en text-2xl font-semibold ${
          isFounding ? 'text-accent' : 'text-text-primary'
        }`}
      >
        {dateStr}
      </span>

      {/* Event name */}
      <p
        lang="ja"
        className={`mt-1 font-ja leading-relaxed ${
          isFounding ? 'text-lg font-medium text-text-primary' : 'text-base text-text-primary'
        }`}
      >
        {eventJa}
      </p>

      {/* Category badge */}
      <span
        className={`mt-3 inline-block rounded-full px-3 py-0.5 text-xs font-medium ${meta.colorClass}`}
      >
        {meta.label}
      </span>

      {/* Entities */}
      {entities.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {entities.map((entity) => (
            <span
              key={entity}
              lang="ja"
              className="font-ja text-xs text-text-muted"
            >
              {entity}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* ---- Desktop layout (md+): alternating left / right ---- */}
      <motion.div
        variants={isLeft ? cardLeftVariants : cardRightVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className={`
          relative mb-12 hidden md:block
          ${isLeft ? 'md:pr-[calc(50%+28px)]' : 'md:pl-[calc(50%+28px)]'}
        `}
      >
        {/* Dot on the center line */}
        <span
          className={`
            absolute top-5 z-10 hidden md:block
            ${isLeft ? 'right-[calc(50%-5px)]' : 'left-[calc(50%-5px)]'}
            h-[10px] w-[10px] rounded-full ${meta.dotColor}
            ${isFounding ? 'ring-2 ring-accent/40 ring-offset-2 ring-offset-bg-primary' : ''}
          `}
        />
        {card}
      </motion.div>

      {/* ---- Mobile layout: stacked on the right of the line ---- */}
      <motion.div
        variants={cardMobileVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative mb-8 pl-10 md:hidden"
      >
        {/* Dot on the left line */}
        <span
          className={`
            absolute left-[11px] top-5 z-10
            h-[10px] w-[10px] rounded-full ${meta.dotColor}
            ${isFounding ? 'ring-2 ring-accent/40 ring-offset-2 ring-offset-bg-primary' : ''}
          `}
        />
        {card}
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Legend                                                             */
/* ------------------------------------------------------------------ */

function CategoryLegend() {
  const categories: TimelineCategory[] = [
    'movement',
    'policy_change',
    'organization_event',
    'social_context',
  ];

  return (
    <div className="mb-12 flex flex-wrap gap-x-6 gap-y-3">
      {categories.map((cat) => {
        const meta = categoryMeta[cat];
        return (
          <div key={cat} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${meta.dotColor}`} />
            <span className="text-sm text-text-secondary">{meta.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main section                                                       */
/* ------------------------------------------------------------------ */

export default function HiddenGenealogy() {
  return (
    <Section id="genealogy">
      <SectionHeading
        title="見えない系譜"
        titleJa="系譜"
        subtitle="東京CPBは突然生まれたわけではありません。数十年にわたる市民運動、生活協同組合、そして政策の変遷から生まれました。"
      />

      <CategoryLegend />

      {/* Timeline container */}
      <div className="relative">
        <TimelineLine />

        {timelineEvents.map((evt, i) => (
          <TimelineCard
            key={`${evt.year}-${evt.event_ja}`}
            year={evt.year}
            month={evt.month}
            eventJa={evt.event_ja}
            category={evt.category}
            entities={evt.entities}
            index={i}
            isFounding={evt.event_ja === FOUNDING_EVENT}
          />
        ))}
      </div>
    </Section>
  );
}
