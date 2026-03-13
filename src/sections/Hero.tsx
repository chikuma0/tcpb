import { motion } from 'framer-motion';

function ConcentricCircles() {
  const circles = [
    { r: 60, label: 'Citizen', delay: 0 },
    { r: 110, label: 'CPB', delay: 0.5 },
    { r: 160, label: 'Community', delay: 1.0 },
  ];

  return (
    <svg
      viewBox="-200 -200 400 400"
      className="mx-auto mt-12 h-48 w-48 md:h-64 md:w-64"
      aria-hidden="true"
    >
      {circles.map(({ r, delay }, i) => (
        <motion.circle
          key={i}
          cx={0}
          cy={0}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          className="text-accent"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 0.6, 0.2, 0.6],
            scale: [0.92, 1.0, 0.96, 1.0],
          }}
          transition={{
            delay: 1.2 + delay,
            duration: 4,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: 'center' }}
        />
      ))}
      {/* Small center dot */}
      <motion.circle
        cx={0}
        cy={0}
        r={4}
        className="fill-accent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.8 }}
      />
    </svg>
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5, duration: 1 }}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs tracking-widest text-text-muted uppercase">
          Scroll
        </span>
        <motion.div
          className="h-8 w-px bg-text-muted"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{
            delay: 2.5,
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: 'top' }}
        />
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 40%, #ffffff 0%, #f0ebe3 100%)',
      }}
    >
      <div className="px-6 text-center">
        {/* Japanese title */}
        <motion.h1
          lang="ja"
          className="font-ja text-[2rem] leading-tight font-semibold text-text-primary sm:text-5xl md:text-7xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          わたしのお金が
          <br />
          わたしの地域でまわる
        </motion.h1>

        {/* English subtitle */}
        <motion.p
          className="mt-6 text-sm tracking-[0.2em] text-accent uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
        >
          Tokyo Community Power Bank
        </motion.p>

        {/* Tagline */}
        <motion.p
          className="mt-3 text-base text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.9 }}
        >
          20 Years of Citizen Finance
        </motion.p>

        {/* Concentric circles animation */}
        <ConcentricCircles />
      </div>

      <ScrollIndicator />
    </section>
  );
}
