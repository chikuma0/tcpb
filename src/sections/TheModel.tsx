import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { conceptModel } from '@/data';
import Section from '@/components/Layout/Section';
import SectionHeading from '@/components/Layout/SectionHeading';
import FadeIn from '@/components/Motion/FadeIn';

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const leftCircleVariants: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const rightCircleVariants: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const centerLabelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut', delay: 0.7 },
  },
};

const bulletContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 1.0 },
  },
};

const bulletItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const goalVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: 1.4 },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type HoveredCircle = 'left' | 'right' | null;

// These labels were originally tuned for a darker background.
const modelPalette = {
  leftCircle: '#c9a96e',
  leftText: '#8b6914',
  rightCircle: '#d0b17b',
  rightStroke: '#9b7b46',
  rightText: '#866936',
  supportingText: '#6b6058',
  centerText: '#2c2520',
};

export default function TheModel() {
  const [hovered, setHovered] = useState<HoveredCircle>(null);

  const leftOpacity = hovered === 'right' ? 0.35 : 1;
  const rightOpacity = hovered === 'left' ? 0.35 : 1;

  return (
    <Section id="model">
      <SectionHeading
        title="しくみ"
        titleJa="しくみ"
        subtitle="東京CPBは二つの力で動いています。市民による「意志ある出資」と、地域を支える「意義ある融資」。この二つが循環することで、私的な資本が公共の力になります。"
      />

      {/* ---------- SVG Venn Diagram ---------- */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-3xl"
      >
        <svg
          viewBox="0 0 700 420"
          className="w-full"
          role="img"
          aria-label={conceptModel.model_name_ja}
        >
          <defs>
            {/* Radial gradients for circle fills */}
            <radialGradient id="leftGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={modelPalette.leftCircle} stopOpacity="0.15" />
              <stop offset="100%" stopColor={modelPalette.leftCircle} stopOpacity="0.05" />
            </radialGradient>
            <radialGradient id="rightGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={modelPalette.rightCircle} stopOpacity="0.16" />
              <stop offset="100%" stopColor={modelPalette.rightCircle} stopOpacity="0.06" />
            </radialGradient>
            <radialGradient id="overlapGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={modelPalette.leftCircle} stopOpacity="0.30" />
              <stop offset="100%" stopColor={modelPalette.leftCircle} stopOpacity="0.12" />
            </radialGradient>

            {/* Clip paths for the overlap region */}
            <clipPath id="clipLeft">
              <circle cx="250" cy="190" r="140" />
            </clipPath>
            <clipPath id="clipRight">
              <circle cx="450" cy="190" r="140" />
            </clipPath>
          </defs>

          {/* Left circle */}
          <motion.g
            variants={leftCircleVariants}
            style={{ opacity: leftOpacity, transition: 'opacity 0.3s ease' }}
            onMouseEnter={() => setHovered('left')}
            onMouseLeave={() => setHovered(null)}
            className="cursor-pointer"
          >
            <circle
              cx="250"
              cy="190"
              r="140"
              fill="url(#leftGrad)"
              stroke={modelPalette.leftCircle}
              strokeWidth="1.5"
              strokeOpacity="0.6"
            />
          </motion.g>

          {/* Right circle */}
          <motion.g
            variants={rightCircleVariants}
            style={{ opacity: rightOpacity, transition: 'opacity 0.3s ease' }}
            onMouseEnter={() => setHovered('right')}
            onMouseLeave={() => setHovered(null)}
            className="cursor-pointer"
          >
            <circle
              cx="450"
              cy="190"
              r="140"
              fill="url(#rightGrad)"
              stroke={modelPalette.rightStroke}
              strokeWidth="1.6"
              strokeOpacity="0.72"
            />
          </motion.g>

          {/* Overlap highlight */}
          <motion.g
            variants={centerLabelVariants}
            style={{ pointerEvents: 'none' }}
          >
            {/* Draw the overlap as the right circle clipped to the left circle */}
            <g clipPath="url(#clipLeft)">
              <circle cx="450" cy="190" r="140" fill="url(#overlapGrad)" />
            </g>
          </motion.g>

          {/* ---- Labels ---- */}

          {/* Left circle label */}
          <motion.g variants={leftCircleVariants}>
            <text
              x="185"
              y="115"
              textAnchor="middle"
              className="font-ja"
              fill={modelPalette.leftText}
              fontSize="16"
              fontWeight="600"
            >
              {conceptModel.left_circle.label_ja}
            </text>
            <text
              x="185"
              y="135"
              textAnchor="middle"
              fill={modelPalette.supportingText}
              fontSize="10"
              fontFamily="Inter, sans-serif"
            >
              Intentional Investment
            </text>
          </motion.g>

          {/* Right circle label */}
          <motion.g variants={rightCircleVariants}>
            <text
              x="515"
              y="115"
              textAnchor="middle"
              className="font-ja"
              fill={modelPalette.rightText}
              fontSize="16"
              fontWeight="600"
            >
              {conceptModel.right_circle.label_ja}
            </text>
            <text
              x="515"
              y="135"
              textAnchor="middle"
              fill={modelPalette.supportingText}
              fontSize="10"
              fontFamily="Inter, sans-serif"
            >
              Meaningful Lending
            </text>
          </motion.g>

          {/* Center label */}
          <motion.g variants={centerLabelVariants}>
            <text
              x="350"
              y="185"
              textAnchor="middle"
              className="font-ja"
              fill={modelPalette.centerText}
              fontSize="20"
              fontWeight="700"
            >
              {conceptModel.center}
            </text>
            <text
              x="350"
              y="206"
              textAnchor="middle"
              fill={modelPalette.supportingText}
              fontSize="10"
              fontFamily="Inter, sans-serif"
              letterSpacing="0.15em"
            >
              COMMUNITY POWER BANK
            </text>
          </motion.g>

          {/* Left bullet points */}
          <motion.g variants={bulletContainerVariants}>
            {conceptModel.left_circle.points_ja.map((point, i) => (
              <motion.g key={`left-${i}`} variants={bulletItemVariants}>
                <circle
                  cx="145"
                  cy={230 + i * 28}
                  r="2.5"
                  fill={modelPalette.leftText}
                  opacity="0.7"
                />
                <text
                  x="155"
                  y={234 + i * 28}
                  className="font-ja"
                  fill={modelPalette.supportingText}
                  fontSize="10.5"
                >
                  {point}
                </text>
              </motion.g>
            ))}
          </motion.g>

          {/* Right bullet points */}
          <motion.g variants={bulletContainerVariants}>
            {conceptModel.right_circle.points_ja.map((point, i) => (
              <motion.g key={`right-${i}`} variants={bulletItemVariants}>
                <circle
                  cx="435"
                  cy={230 + i * 28}
                  r="2.5"
                  fill={modelPalette.rightText}
                  opacity="0.7"
                />
                <text
                  x="445"
                  y={234 + i * 28}
                  className="font-ja"
                  fill={modelPalette.supportingText}
                  fontSize="10.5"
                >
                  {point}
                </text>
              </motion.g>
            ))}
          </motion.g>
        </svg>

        {/* ---------- Goal statement ---------- */}
        <FadeIn delay={1.4}>
          <motion.p
            variants={goalVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            lang="ja"
            className="mt-8 text-center font-ja text-2xl font-medium tracking-wide text-accent md:text-3xl"
          >
            {conceptModel.goal_ja}
          </motion.p>
          <p className="mt-3 text-center text-sm tracking-widest text-text-secondary">
            しあわせな地域をつくるために
          </p>
        </FadeIn>
      </motion.div>
    </Section>
  );
}
