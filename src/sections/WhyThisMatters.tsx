import { motion } from 'framer-motion';
import { quotes, people, concepts } from '@/data';

const goalConcept = concepts.find(c => c.concept_id === 'concept_004');
const selectedQuotes = quotes.slice(0, 2);

function getPersonRole(speakerName: string): string {
  const person = people.find(p => p.name_ja === speakerName);
  return person?.role_ja || '';
}

export default function WhyThisMatters() {
  return (
    <section id="why" className="py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent text-sm tracking-[0.15em] uppercase mb-3" lang="ja">意義</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-8" lang="ja">なぜ大切なのか</h2>
        </motion.div>

        <motion.div
          className="space-y-6 text-text-secondary leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          lang="ja"
        >
          <p>
            東京CPBは、市民の価値観が金融のインフラになりうることを20年かけて証明してきました。
            生活協同組合、市民運動、そして民主的な運営に根ざした小さな組織が、東京都内の地域団体に5億円以上の融資を届けてきたのです。
          </p>
          <p>
            ここには、リターンを求める株主もいなければ、アルゴリズムによるリスク評価もありません。
            市民の審査委員が、借り手が地域に貢献しているか、民主的に運営されているか、透明性があるかを判断します。
            金利は0.5〜1.0%。担保は不要。目的は利益ではなく、地域のインフラをつくることです。
          </p>
          <p>
            制度への信頼が揺らぎ、金融が抽象化するこの時代に、東京CPBはひとつの対抗モデルを示しています。
            お金が地域にとどまり、市民が決め、成果がリターンではなく地域のしあわせで測られる——そんな仕組みです。
          </p>
        </motion.div>

        {/* Quotes */}
        <div className="mt-16 space-y-8">
          {selectedQuotes.map((quote, i) => (
            <motion.blockquote
              key={i}
              className="border-l-2 border-accent/30 pl-6 py-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
            >
              <p className="text-text-primary text-lg italic leading-relaxed font-light" lang="ja">
                "{quote.quote_ja}"
              </p>
              <footer className="mt-3">
                <cite className="not-italic">
                  <span className="text-text-primary text-sm font-medium" lang="ja">{quote.speaker}</span>
                  <span className="text-text-muted text-sm"> · </span>
                  <span className="text-text-muted text-sm" lang="ja">{getPersonRole(quote.speaker)}</span>
                </cite>
                <p className="text-text-muted text-xs mt-1" lang="ja">
                  座談会より（趣旨再現）
                </p>
              </footer>
            </motion.blockquote>
          ))}
        </div>

        {/* Goal phrase as typographic closer */}
        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <p className="text-3xl md:text-5xl font-bold text-accent leading-tight" lang="ja">
            {goalConcept?.name_ja}
          </p>
          <p className="text-text-secondary text-lg mt-4">
            {goalConcept?.name_en}
          </p>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="mt-24 pt-8 border-t border-black/10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="text-text-muted text-sm" lang="ja">
            東京コミュニティパワーバンク 20周年記念誌（2024年）をもとに構成
          </p>
          <p className="text-text-muted text-xs mt-2" lang="ja">
            「わたしのお金がわたしの地域でまわる」
          </p>
          <p className="text-text-muted text-xs mt-4" lang="ja">
            記念誌から構造化したアーカイブデータに基づいています
          </p>
        </motion.footer>
      </div>
    </section>
  );
}
