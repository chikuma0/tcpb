import { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import * as d3 from 'd3';
import { statistics } from '@/data';
import Section from '@/components/Layout/Section';
import SectionHeading from '@/components/Layout/SectionHeading';
import CountUp from '@/components/Motion/CountUp';
import FadeIn from '@/components/Motion/FadeIn';

/* ------------------------------------------------------------------ */
/*  Sector configuration                                               */
/* ------------------------------------------------------------------ */

const sectorConfig: Record<string, { en: string; color: string }> = {
  '環境保全': { en: 'Environmental', color: '#4a7a52' },
  'まちづくり': { en: 'Community Dev', color: '#5a7a94' },
  '福祉': { en: 'Welfare', color: '#a05a66' },
  'その他': { en: 'Other', color: '#7a7068' },
};

const loanTypeConfig: Record<string, { en: string }> = {
  'つなぎ資金': { en: 'Bridge' },
  '設備投資': { en: 'Equipment' },
  '運転資金': { en: 'Operating' },
};

const loanTypeColors = ['#8b6914', '#9a9088', '#6b6058'];

/* ------------------------------------------------------------------ */
/*  HeadlineMetrics                                                    */
/* ------------------------------------------------------------------ */

function HeadlineMetrics() {
  const metrics = [
    {
      value: statistics.headline_metrics.loan_count_total,
      suffix: '',
      labelJa: '融資件数',
      labelEn: 'Loans',
    },
    {
      value: 5.816,
      suffix: '億',
      prefix: '¥',
      decimals: true,
      labelJa: '融資総額',
      labelEn: 'Total Lending',
    },
    {
      value: statistics.headline_metrics.social_investment_total_yen / 10000,
      suffix: '万',
      prefix: '¥',
      labelJa: '社会的投資',
      labelEn: `${statistics.headline_metrics.social_investment_count} Social Investments`,
    },
  ];

  return (
    <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
      {metrics.map((m, i) => (
        <FadeIn key={i} delay={i * 0.15} className="text-center">
          <div className="text-5xl font-semibold text-accent md:text-6xl">
            {m.decimals ? (
              <DecimalCountUp
                end={m.value}
                prefix={m.prefix ?? ''}
                suffix={m.suffix}
              />
            ) : (
              <CountUp
                end={m.value}
                prefix={m.prefix ?? ''}
                suffix={m.suffix}
                className="text-5xl font-semibold text-accent md:text-6xl"
              />
            )}
          </div>
          <p lang="ja" className="mt-2 font-ja text-sm text-text-secondary">
            {m.labelJa}
          </p>
          <p className="text-xs tracking-wider text-text-muted uppercase">
            {m.labelEn}
          </p>
        </FadeIn>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DecimalCountUp for 5.816 value                                     */
/* ------------------------------------------------------------------ */

function DecimalCountUp({
  end,
  prefix = '',
  suffix = '',
}: {
  end: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration: 1500,
    bounce: 0,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(end);
    }
  }, [isInView, end, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest.toFixed(3)}${suffix}`;
      }
    });
    return unsubscribe;
  }, [springValue, prefix, suffix]);

  return (
    <motion.span
      ref={ref}
      className="text-5xl font-semibold text-accent md:text-6xl"
    >
      {prefix}0.000{suffix}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/*  DonutChart                                                         */
/* ------------------------------------------------------------------ */

function DonutChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const sectorEntries = Object.entries(statistics.sector_distribution_percent);
  const pieData = sectorEntries.map(([key, value]) => ({
    key,
    value,
    color: sectorConfig[key]?.color ?? '#8a8078',
    en: sectorConfig[key]?.en ?? key,
  }));

  const pie = d3
    .pie<(typeof pieData)[number]>()
    .value((d) => d.value)
    .sort(null)
    .padAngle(0.02);

  const size = 240;
  const outerRadius = size / 2 - 10;
  const innerRadius = outerRadius * 0.58;

  const arcGenerator = d3.arc<d3.PieArcDatum<(typeof pieData)[number]>>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  const arcs = pie(pieData);

  return (
    <figure ref={ref}>
      <div className="flex flex-col items-center">
        <svg
          viewBox={`-${size / 2} -${size / 2} ${size} ${size}`}
          className="h-60 w-60 md:h-72 md:w-72"
          role="img"
          aria-label="Sector distribution donut chart"
        >
          {arcs.map((arc, i) => {
            const path = arcGenerator(arc);

            return (
              <motion.path
                key={arc.data.key}
                d={path ?? ''}
                fill={arc.data.color}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.6 }
                }
                transition={{
                  duration: 0.7,
                  delay: i * 0.12,
                  ease: 'easeOut',
                }}
                style={{ transformOrigin: 'center' }}
              />
            );
          })}
        </svg>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-2">
          {pieData.map((d) => (
            <div key={d.key} className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-sm text-text-secondary">
                <span lang="ja" className="font-ja">
                  {d.key}
                </span>{' '}
                <span className="text-text-muted">/ {d.en}</span>{' '}
                <span className="text-text-primary">{d.value}%</span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="mt-4 text-center text-xs text-text-muted" lang="ja">
        融資114件の分野別分布：環境保全40%、まちづくり25%、福祉17%、その他18%。
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  HorizontalBarChart                                                 */
/* ------------------------------------------------------------------ */

function HorizontalBarChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const loanEntries = Object.entries(
    statistics.loan_type_distribution_percent,
  ).map(([key, value], i) => ({
    key,
    value,
    en: loanTypeConfig[key]?.en ?? key,
    color: loanTypeColors[i] ?? '#6b6358',
  }));

  return (
    <figure ref={ref}>
      <div className="space-y-5">
        {loanEntries.map((entry, i) => (
          <div key={entry.key}>
            {/* Labels */}
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="text-sm text-text-secondary">
                <span lang="ja" className="font-ja">
                  {entry.key}
                </span>{' '}
                <span className="text-text-muted">/ {entry.en}</span>
              </span>
              <span className="text-sm font-medium text-text-primary">
                {entry.value}%
              </span>
            </div>

            {/* Bar track */}
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-bg-elevated">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: entry.color }}
                initial={{ width: '0%' }}
                animate={
                  isInView ? { width: `${entry.value}%` } : { width: '0%' }
                }
                transition={{
                  duration: 1,
                  delay: 0.2 + i * 0.15,
                  ease: 'easeOut',
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <figcaption className="mt-4 text-xs text-text-muted" lang="ja">
        融資種別の分布：つなぎ資金66%、設備投資24%、運転資金10%。地域団体への短期資金供給がCPBの中心的役割です。
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  TheNumbers (main export)                                           */
/* ------------------------------------------------------------------ */

export default function TheNumbers() {
  return (
    <Section id="numbers" className="bg-bg-primary">
      <SectionHeading
        title="実績"
        titleJa="実績と数字"
        subtitle={`${statistics.period} — 市民主導の地域金融、20年間の歩み。`}
      />

      {/* Headline metrics */}
      <HeadlineMetrics />

      {/* Charts grid */}
      <div className="mt-24 grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
        {/* Donut chart */}
        <FadeIn>
          <h3 className="mb-8 text-lg font-medium text-text-primary" lang="ja">
            分野別分布
          </h3>
          <DonutChart />
        </FadeIn>

        {/* Bar chart */}
        <FadeIn delay={0.2}>
          <h3 className="mb-8 text-lg font-medium text-text-primary" lang="ja">
            融資種別
          </h3>
          <HorizontalBarChart />
        </FadeIn>
      </div>

      {/* Period label */}
      <div className="mt-20 text-center">
        <span className="text-xs tracking-widest text-text-muted uppercase">
          {statistics.period}
        </span>
      </div>
    </Section>
  );
}
