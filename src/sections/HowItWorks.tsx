import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { financialModel, governance } from '@/data';

const stages = [
  {
    id: 'citizens',
    titleJa: '市民',
    titleEn: 'Citizens',
    description: '一人ひとりの市民が、自分のお金の使い道を意志をもって選ぶ。従来の金融商品ではなく、地域のために活かす道を。',
    icon: '●',
  },
  {
    id: 'investment',
    titleJa: '意志ある出資',
    titleEn: 'Intentional Investment',
    description: '「私のお金を環境破壊や戦争に使われたくない。住みやすい地域をつくるために使いたい」——そんな一人ひとりの意志が、出資というかたちになります。',
    icon: '→',
  },
  {
    id: 'cpb',
    titleJa: '東京CPB',
    titleEn: 'Tokyo CPB',
    description: '東京コミュニティパワーバンクが市民の資本を集め、民主的なガバナンスのもと、透明性と説明責任をもって運営します。',
    icon: '◆',
  },
  {
    id: 'review',
    titleJa: '市民審査委員会',
    titleEn: 'Citizen Review Committee',
    description: '市民と専門家からなる審査委員会が、社会的使命と財務能力の両面から申請を審査します。',
    details: financialModel.review_criteria_ja,
    detailLabel: '審査基準',
    icon: '☆',
  },
  {
    id: 'lending',
    titleJa: '意義ある融資',
    titleEn: 'Meaningful Lending',
    description: '審査を通過した団体には、無担保で年利0.5〜1.0%、最長5年の融資を提供。つなぎ資金は1年以内で対応します。',
    details: Object.entries(financialModel.interest_rates).map(([k, v]) => `${k}: ${v}`),
    detailLabel: '金利一覧',
    icon: '→',
  },
  {
    id: 'outcomes',
    titleJa: 'しあわせな地域',
    titleEn: 'Community Outcomes',
    description: '融資を受けた団体が、東京各地にコミュニティカフェ、支援センター、協同組合、環境保全事業、社会的企業といった地域のインフラをつくっています。',
    icon: '●',
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function HowItWorks() {
  const [activeStage, setActiveStage] = useState<string | null>(null);

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-bg-secondary">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent text-sm tracking-[0.15em] uppercase mb-3" lang="ja">仕組み</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" lang="ja">
            お金の流れ
          </h2>
          <p className="text-text-secondary max-w-2xl mb-6" lang="ja">
            一人の市民から地域の成果へ — 意志ある資本が東京CPBを通じて届くまで。
          </p>
        </motion.div>

        {/* Governance note */}
        <motion.p
          className="text-text-muted text-sm max-w-2xl mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {governance.key_structures.principles_ja.map((p, i) => (
            <span key={i} lang="ja">
              {i > 0 && ' · '}
              {p}
            </span>
          ))}
        </motion.p>

        {/* Flow diagram - vertical */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-accent/20 md:-translate-x-px" />

          <div className="space-y-6 md:space-y-8">
            {stages.map((stage, i) => (
              <motion.div
                key={stage.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="relative"
              >
                {/* Node dot on the line */}
                <div className="absolute left-6 md:left-1/2 top-6 w-3 h-3 -translate-x-1.5 rounded-full bg-accent z-10" />

                {/* Card */}
                <div
                  className={`ml-14 md:ml-0 ${
                    i % 2 === 0 ? 'md:mr-[52%]' : 'md:ml-[52%]'
                  }`}
                >
                  <button
                    onClick={() => setActiveStage(activeStage === stage.id ? null : stage.id)}
                    className="w-full text-left bg-bg-elevated rounded-lg p-5 md:p-6 border border-black/5 hover:border-accent/30 transition-colors cursor-pointer"
                    aria-expanded={activeStage === stage.id}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-accent text-lg mt-0.5 shrink-0">{stage.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <h3 className="text-lg font-medium text-text-primary" lang="ja">
                            {stage.titleJa}
                          </h3>
                          <span className="text-text-muted text-sm">{stage.titleEn}</span>
                        </div>
                        <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                          {stage.description}
                        </p>

                        {/* Expandable details */}
                        {stage.details && (
                          <motion.div
                            initial={false}
                            animate={{
                              height: activeStage === stage.id ? 'auto' : 0,
                              opacity: activeStage === stage.id ? 1 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-black/10">
                              <p className="text-accent text-xs tracking-wider uppercase mb-2">
                                {stage.detailLabel}
                              </p>
                              <ul className="space-y-1">
                                {stage.details.map((detail, j) => (
                                  <li key={j} className="text-text-secondary text-sm flex items-start gap-2" lang="ja">
                                    <span className="text-accent/50 mt-1 text-xs">▸</span>
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}

                        {stage.details && (
                          <p className="text-accent/60 text-xs mt-2">
                            {activeStage === stage.id ? '閉じる' : '詳細を見る'}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Guarantee note */}
        <motion.div
          className="mt-12 p-4 bg-bg-elevated rounded-lg border border-black/5 max-w-lg mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-text-muted text-sm">
            <span lang="ja">{financialModel.guarantee_ja.join(' · ')}</span>
          </p>
          <p className="text-text-muted text-xs mt-1" lang="ja">無担保・連帯保証人2名以上</p>
        </motion.div>
      </div>
    </section>
  );
}
