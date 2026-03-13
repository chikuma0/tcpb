import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { locations, organizations, buildLocationOrgLookup } from '@/data';

// Approximate centroids for Tokyo wards/cities (relative coordinates in a 500x500 viewBox)
// These are editorial approximations for the diagrammatic map
const locationCoords: Record<string, { x: number; y: number }> = {
  '千代田区': { x: 280, y: 240 },
  '新宿区': { x: 250, y: 220 },
  '杉並区': { x: 200, y: 210 },
  '板橋区': { x: 260, y: 170 },
  '江戸川区': { x: 350, y: 260 },
  '荒川区': { x: 310, y: 190 },
  '世田谷区': { x: 210, y: 280 },
  '八王子市': { x: 80, y: 260 },
  '松戸市': { x: 380, y: 170 },
  '狛江市': { x: 195, y: 310 },
  '町田市': { x: 150, y: 340 },
  '多摩市': { x: 140, y: 300 },
  '東京': { x: 290, y: 250 },
};

const orgTypeColors: Record<string, string> = {
  community_cafe: '#a67c00',
  nonprofit: '#a05a66',
  sports_club: '#5a7a94',
  support_center: '#a05a66',
  workers_collective: '#4a7a52',
  community_support: '#5a7a94',
  social_enterprise: '#4a7a52',
  housing_collective: '#5a7a94',
  environmental_project: '#4a7a52',
  community_business: '#a67c00',
  community_space: '#a67c00',
  meal_service: '#a05a66',
};

const orgTypeLabels: Record<string, string> = {
  community_cafe: 'コミュニティカフェ',
  nonprofit: 'NPO法人',
  sports_club: 'スポーツクラブ',
  support_center: '支援センター',
  workers_collective: 'ワーカーズコレクティブ',
  community_support: '地域支援',
  social_enterprise: '社会的企業',
  housing_collective: '住宅協同組合',
  environmental_project: '環境保全',
  community_business: 'コミュニティビジネス',
  community_space: 'コミュニティスペース',
  meal_service: '配食サービス',
};

export default function TokyoFootprint() {
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const locationOrgLookup = useMemo(() => buildLocationOrgLookup(organizations), []);

  const legendItems = useMemo(() => {
    const types = new Set(organizations.map(o => o.type));
    return Array.from(types).map(t => ({
      type: t,
      color: orgTypeColors[t] || '#8a8078',
      label: orgTypeLabels[t] || t,
    }));
  }, []);

  return (
    <section id="footprint" className="py-24 md:py-32 bg-bg-secondary">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent text-sm tracking-[0.15em] uppercase mb-3" lang="ja">地理</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" lang="ja">東京の足跡</h2>
          <p className="text-text-secondary max-w-2xl mb-4" lang="ja">
            市民金融が地域と出会う場所。東京都内13地域に14団体を支援しています。
          </p>
        </motion.div>

        <div className="grid md:grid-cols-[1fr_300px] gap-8 items-start mt-8">
          {/* Diagrammatic map */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <svg
              viewBox="0 0 480 420"
              className="w-full h-auto"
              role="img"
              aria-label="Map showing the geographic distribution of Tokyo CPB funded organizations across the Tokyo metropolitan area"
            >
              {/* Stylized Tokyo outline */}
              <path
                d="M60,180 Q80,120 160,100 Q200,90 260,100 Q320,85 370,120 Q400,150 410,200 Q420,250 400,290 Q380,320 350,340 Q300,370 240,370 Q180,370 140,350 Q100,330 80,300 Q60,260 60,220 Z"
                fill="none"
                stroke="#2c2520"
                strokeWidth="1"
                strokeOpacity="0.15"
              />
              {/* Inner area suggestion - western Tokyo (Tama region) */}
              <path
                d="M60,220 Q70,180 100,160 Q130,140 160,140 L160,340 Q120,330 90,300 Q70,270 60,240 Z"
                fill="#2c2520"
                fillOpacity="0.03"
              />
              {/* Central Tokyo */}
              <path
                d="M160,140 Q220,100 300,110 Q360,130 380,180 Q400,240 380,300 Q340,350 280,360 Q200,370 160,340 Z"
                fill="#2c2520"
                fillOpacity="0.03"
              />
              {/* Chiba extension (Matsudo) */}
              <ellipse cx="380" cy="170" rx="40" ry="35" fill="#2c2520" fillOpacity="0.02" stroke="#2c2520" strokeWidth="0.5" strokeOpacity="0.1" />

              {/* Region labels */}
              <text x="100" y="380" fill="#2c2520" fillOpacity="0.15" fontSize="10" fontFamily="var(--font-en)">Western Tokyo</text>
              <text x="250" y="380" fill="#2c2520" fillOpacity="0.15" fontSize="10" fontFamily="var(--font-en)">Central Tokyo</text>
              <text x="370" y="145" fill="#2c2520" fillOpacity="0.15" fontSize="8" fontFamily="var(--font-en)">Chiba</text>

              {/* Location pins */}
              {locations.map((loc, i) => {
                const coords = locationCoords[loc.location_name];
                if (!coords) return null;
                const orgsHere = locationOrgLookup[loc.location_name] || [];
                const primaryOrg = orgsHere[0];
                const pinColor = primaryOrg ? (orgTypeColors[primaryOrg.type] || '#8a8078') : '#8a8078';
                const isActive = activeLocation === loc.location_name;
                const hasMultiple = orgsHere.length > 1;

                return (
                  <motion.g
                    key={loc.location_id}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.4, type: 'spring' }}
                  >
                    {/* Connection line to center */}
                    <line
                      x1={coords.x}
                      y1={coords.y}
                      x2={280}
                      y2={240}
                      stroke={pinColor}
                      strokeOpacity={isActive ? 0.3 : 0.06}
                      strokeWidth={0.5}
                      style={{ transition: 'stroke-opacity 0.3s' }}
                    />
                    {/* Pin */}
                    <g
                      className="cursor-pointer"
                      onMouseEnter={() => setActiveLocation(loc.location_name)}
                      onMouseLeave={() => setActiveLocation(null)}
                      onClick={() => setActiveLocation(isActive ? null : loc.location_name)}
                    >
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={hasMultiple ? 7 : 5}
                        fill={pinColor}
                        fillOpacity={isActive ? 1 : 0.7}
                        stroke={isActive ? '#2c2520' : 'none'}
                        strokeWidth={1.5}
                        style={{ transition: 'all 0.3s' }}
                      />
                      {/* Pulse animation for active */}
                      {isActive && (
                        <circle
                          cx={coords.x}
                          cy={coords.y}
                          r={hasMultiple ? 7 : 5}
                          fill="none"
                          stroke={pinColor}
                          strokeWidth={1}
                          opacity={0.5}
                        >
                          <animate attributeName="r" from={hasMultiple ? '7' : '5'} to="18" dur="1.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                      )}
                      {/* Location name */}
                      <text
                        x={coords.x}
                        y={coords.y - (hasMultiple ? 12 : 10)}
                        textAnchor="middle"
                        fill="#2c2520"
                        fillOpacity={isActive ? 0.9 : 0.4}
                        fontSize="8"
                        fontFamily="var(--font-ja)"
                        style={{ transition: 'fill-opacity 0.3s' }}
                      >
                        {loc.location_name}
                      </text>
                    </g>
                  </motion.g>
                );
              })}

              {/* CPB center marker */}
              <circle cx="280" cy="240" r="3" fill="#2c2520" fillOpacity="0.3" />
              <text x="280" y="255" textAnchor="middle" fill="#2c2520" fillOpacity="0.2" fontSize="7" fontFamily="var(--font-ja)">
                東京CPB
              </text>
            </svg>
          </motion.div>

          {/* Info panel */}
          <div className="space-y-4">
            {/* Active location detail */}
            {activeLocation ? (
              <motion.div
                key={activeLocation}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-elevated rounded-lg p-4 border border-black/10"
              >
                <h3 className="text-text-primary font-medium text-lg" lang="ja">{activeLocation}</h3>
                <div className="mt-3 space-y-3">
                  {(locationOrgLookup[activeLocation] || []).map(org => (
                    <div key={org.organization_id}>
                      <p className="text-text-primary text-sm" lang="ja">{org.name_ja}</p>
                      <p className="text-text-muted text-xs">
                        <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: orgTypeColors[org.type] || '#8a8078' }} />
                        {orgTypeLabels[org.type] || org.type}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="bg-bg-elevated rounded-lg p-4 border border-black/5">
                <p className="text-text-muted text-sm" lang="ja">
                  地図上のピンにカーソルを合わせると、支援先の情報が表示されます。
                </p>
              </div>
            )}

            {/* Legend */}
            <div className="bg-bg-elevated rounded-lg p-4 border border-black/5">
              <p className="text-text-muted text-xs tracking-wider uppercase mb-3" lang="ja">支援先の種類</p>
              <div className="space-y-1.5">
                {legendItems.map(item => (
                  <div key={item.type} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-text-secondary text-xs">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary stat */}
            <div className="text-center pt-2">
              <p className="text-text-muted text-xs">
                {organizations.length}団体 · {locations.length}地域
              </p>
            </div>
          </div>
        </div>

        {/* Accessible text */}
        <figcaption className="sr-only">
          Tokyo CPB has funded 14 organizations across 13 locations in the greater Tokyo area,
          including wards like Shinjuku, Suginami, Setagaya, and Chiyoda, as well as western
          cities like Hachioji, Tama, and Machida, and Matsudo in neighboring Chiba prefecture.
        </figcaption>
      </div>
    </section>
  );
}
