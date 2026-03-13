import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { graphNodes, graphEdges, buildAdjacencyMap, type GraphNode, type GraphEdge, type NodeType } from '@/data';

// Filter out meta nodes (financial_model, statistics, governance) for visual clarity
const visualNodeTypes: NodeType[] = ['organization', 'person', 'concept', 'location', 'project'];
const filteredNodes = graphNodes.filter(n => visualNodeTypes.includes(n.type) || n.node_id === 'org_tokyo_cpb');
const filteredNodeIds = new Set(filteredNodes.map(n => n.node_id));
const filteredEdges = graphEdges.filter(e => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target));

const nodeConfig: Record<string, { color: string; radius: number; shape: string; label: string }> = {
  organization: { color: '#a67c00', radius: 8, shape: 'circle', label: '団体' },
  person: { color: '#a05a66', radius: 7, shape: 'circle', label: '人' },
  concept: { color: '#8b7330', radius: 9, shape: 'diamond', label: '理念' },
  location: { color: '#5a7a94', radius: 6, shape: 'rect', label: '地域' },
  project: { color: '#4a7a52', radius: 6, shape: 'circle-dotted', label: '事業' },
};

const edgeStyle: Record<string, string> = {
  affiliated_with: '4,2',
  embodies_concept: '2,2',
  funds_or_supports: '',
  located_in: '1,3',
  operates_project: '',
  takes_place_in: '1,3',
  milestone_for: '6,3',
};

interface SimNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx?: number | null;
  fy?: number | null;
}

type FilterType = 'all' | NodeType;

export default function TheEcosystem() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<SimNode[]>([]);
  const [edges, setEdges] = useState<{ source: SimNode; target: SimNode; edge: GraphEdge }[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isMobile, setIsMobile] = useState(false);
  const simulationRef = useRef<d3.Simulation<SimNode, undefined> | null>(null);

  const adjacency = useMemo(() => buildAdjacencyMap(filteredNodes, filteredEdges), []);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const width = 800;
    const height = 600;
    const simNodes: SimNode[] = filteredNodes.map(n => ({
      ...n,
      x: width / 2 + (Math.random() - 0.5) * 100,
      y: height / 2 + (Math.random() - 0.5) * 100,
      vx: 0,
      vy: 0,
    }));

    // Pin CPB to center
    const cpbNode = simNodes.find(n => n.node_id === 'org_tokyo_cpb');
    if (cpbNode) {
      cpbNode.fx = width / 2;
      cpbNode.fy = height / 2;
    }

    const simEdges = filteredEdges.map(e => ({
      source: simNodes.find(n => n.node_id === e.source)!,
      target: simNodes.find(n => n.node_id === e.target)!,
      edge: e,
    })).filter(e => e.source && e.target);

    const simulation = d3.forceSimulation(simNodes)
      .force('link', d3.forceLink(simEdges).id((d: unknown) => (d as SimNode).node_id).distance(80))
      .force('charge', d3.forceManyBody().strength(-120))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(15))
      .on('tick', () => {
        setNodes([...simNodes]);
        setEdges([...simEdges]);
      });

    simulationRef.current = simulation;

    // Stop after 3 seconds
    const timeout = setTimeout(() => simulation.stop(), 3000);

    return () => {
      clearTimeout(timeout);
      simulation.stop();
    };
  }, [isMobile]);

  const isNodeVisible = useCallback((node: GraphNode) => {
    if (filter === 'all') return true;
    if (node.node_id === 'org_tokyo_cpb') return true;
    return node.type === filter;
  }, [filter]);

  const isNodeHighlighted = useCallback((nodeId: string) => {
    if (!hoveredNode) return true;
    if (nodeId === hoveredNode) return true;
    return adjacency[hoveredNode]?.neighbors.includes(nodeId) ?? false;
  }, [hoveredNode, adjacency]);

  const selectedNodeData = useMemo(() => {
    if (!selectedNode) return null;
    const node = filteredNodes.find(n => n.node_id === selectedNode);
    if (!node) return null;
    const connections = adjacency[selectedNode]?.neighbors.map(nId =>
      filteredNodes.find(n => n.node_id === nId)
    ).filter(Boolean) ?? [];
    return { node, connections };
  }, [selectedNode, adjacency]);

  const renderNodeShape = (node: SimNode, config: typeof nodeConfig[string]) => {
    const visible = isNodeVisible(node) && isNodeHighlighted(node.node_id);
    const opacity = visible ? 1 : 0.1;
    const isCPB = node.node_id === 'org_tokyo_cpb';
    const r = isCPB ? 14 : config.radius;

    if (config.shape === 'diamond') {
      return (
        <g
          key={node.node_id}
          transform={`translate(${node.x},${node.y})`}
          opacity={opacity}
          style={{ transition: 'opacity 0.3s' }}
          onMouseEnter={() => setHoveredNode(node.node_id)}
          onMouseLeave={() => setHoveredNode(null)}
          onClick={() => setSelectedNode(selectedNode === node.node_id ? null : node.node_id)}
          className="cursor-pointer"
        >
          <rect
            width={r * 1.4}
            height={r * 1.4}
            x={-r * 0.7}
            y={-r * 0.7}
            fill={config.color}
            transform="rotate(45)"
            rx={1}
          />
        </g>
      );
    }

    if (config.shape === 'rect') {
      return (
        <g
          key={node.node_id}
          transform={`translate(${node.x},${node.y})`}
          opacity={opacity}
          style={{ transition: 'opacity 0.3s' }}
          onMouseEnter={() => setHoveredNode(node.node_id)}
          onMouseLeave={() => setHoveredNode(null)}
          onClick={() => setSelectedNode(selectedNode === node.node_id ? null : node.node_id)}
          className="cursor-pointer"
        >
          <rect
            width={r * 1.6}
            height={r * 1.6}
            x={-r * 0.8}
            y={-r * 0.8}
            fill={config.color}
            rx={2}
          />
        </g>
      );
    }

    return (
      <g
        key={node.node_id}
        transform={`translate(${node.x},${node.y})`}
        opacity={opacity}
        style={{ transition: 'opacity 0.3s' }}
        onMouseEnter={() => setHoveredNode(node.node_id)}
        onMouseLeave={() => setHoveredNode(null)}
        onClick={() => setSelectedNode(selectedNode === node.node_id ? null : node.node_id)}
        className="cursor-pointer"
      >
        <circle
          r={r}
          fill={isCPB ? '#2c2520' : config.color}
          stroke={config.shape === 'circle-dotted' ? config.color : 'none'}
          strokeWidth={config.shape === 'circle-dotted' ? 1.5 : 0}
          strokeDasharray={config.shape === 'circle-dotted' ? '2,2' : ''}
          fillOpacity={config.shape === 'circle-dotted' ? 0.3 : 1}
        />
        {isCPB && (
          <text
            textAnchor="middle"
            dy="0.35em"
            fill="#faf7f2"
            fontSize="8"
            fontWeight="600"
            fontFamily="var(--font-ja)"
          >
            CPB
          </text>
        )}
      </g>
    );
  };

  // Mobile: list view
  if (isMobile) {
    const groupedByType = Object.entries(nodeConfig).map(([type, config]) => ({
      type,
      config,
      items: filteredNodes.filter(n => n.type === type && n.node_id !== 'org_tokyo_cpb'),
    })).filter(g => g.items.length > 0);

    return (
      <section id="ecosystem" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-accent text-sm tracking-[0.15em] uppercase mb-3" lang="ja">生態系</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" lang="ja">つながりの全体像</h2>
            <p className="text-text-secondary max-w-2xl mb-8" lang="ja">
              東京CPBを中心に、人・組織・事業・場所がどうつながっているか。
            </p>
          </motion.div>

          <div className="space-y-8">
            {groupedByType.map(({ type, config, items }) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
                  <h3 className="text-sm font-medium text-text-primary tracking-wider uppercase">
                    {config.label}
                  </h3>
                </div>
                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.node_id} className="bg-bg-elevated rounded-lg p-3 border border-black/8">
                      <p className="text-text-primary text-sm" lang="ja">{item.name_ja}</p>
                      {item.role_ja && <p className="text-text-muted text-xs mt-1" lang="ja">{item.role_ja}</p>}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {adjacency[item.node_id]?.neighbors.slice(0, 3).map(nId => {
                          const neighbor = filteredNodes.find(n => n.node_id === nId);
                          return neighbor ? (
                            <span key={nId} className="text-xs text-text-muted bg-bg-secondary px-2 py-0.5 rounded" lang="ja">
                              {neighbor.name_ja || neighbor.name_en}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Desktop: force graph
  return (
    <section id="ecosystem" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent text-sm tracking-[0.15em] uppercase mb-3" lang="ja">生態系</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4" lang="ja">つながりの全体像</h2>
          <p className="text-text-secondary max-w-2xl mb-6" lang="ja">
            東京CPBを中心に、人・組織・事業・場所がどうつながっているか。ノードにカーソルを合わせると、つながりが表示されます。
          </p>
        </motion.div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[{ type: 'all' as FilterType, label: 'すべて' }, ...Object.entries(nodeConfig).map(([t, c]) => ({ type: t as FilterType, label: c.label }))].map(({ type, label }) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === type
                  ? 'bg-accent text-bg-primary'
                  : 'bg-bg-elevated text-text-secondary hover:text-text-primary border border-black/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative">
          {/* Graph */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <svg
              ref={svgRef}
              viewBox="0 0 800 600"
              className="w-full h-auto max-h-[70vh]"
              role="img"
              aria-label="Network graph showing the ecosystem of Tokyo CPB: people, organizations, projects, and locations"
            >
              {/* Edges */}
              {edges.map(({ source, target, edge }) => {
                const sourceVisible = isNodeVisible(source) && isNodeHighlighted(source.node_id);
                const targetVisible = isNodeVisible(target) && isNodeHighlighted(target.node_id);
                const visible = sourceVisible && targetVisible;
                return (
                  <line
                    key={edge.edge_id}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="#2c2520"
                    strokeOpacity={visible ? 0.15 : 0.03}
                    strokeWidth={1}
                    strokeDasharray={edgeStyle[edge.relationship] || ''}
                    style={{ transition: 'stroke-opacity 0.3s' }}
                  />
                );
              })}

              {/* Nodes */}
              {nodes.map(node => {
                const config = nodeConfig[node.type] || nodeConfig.organization;
                return renderNodeShape(node as SimNode, config);
              })}

              {/* Hover label */}
              {hoveredNode && (() => {
                const node = nodes.find(n => n.node_id === hoveredNode);
                if (!node) return null;
                return (
                  <g transform={`translate(${node.x},${node.y - 20})`}>
                    <rect
                      x={-60}
                      y={-14}
                      width={120}
                      height={20}
                      fill="#ffffff"
                      rx={4}
                      fillOpacity={0.9}
                    />
                    <text
                      textAnchor="middle"
                      dy="-1"
                      fill="#2c2520"
                      fontSize="10"
                      fontFamily="var(--font-ja)"
                    >
                      {(node.name_ja || node.name_en || '').slice(0, 16)}
                    </text>
                  </g>
                );
              })()}
            </svg>
          </motion.div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {Object.entries(nodeConfig).map(([type, config]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: config.color }} />
                <span className="text-text-muted text-xs">{config.label}</span>
              </div>
            ))}
          </div>

          {/* Detail sidebar */}
          {selectedNodeData && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-0 right-0 w-64 bg-bg-elevated border border-black/10 rounded-lg p-4 shadow-xl"
            >
              <button
                onClick={() => setSelectedNode(null)}
                className="absolute top-2 right-2 text-text-muted hover:text-text-primary text-sm"
                aria-label="Close detail panel"
              >
                &times;
              </button>
              <p className="text-text-primary font-medium" lang="ja">{selectedNodeData.node.name_ja}</p>
              {selectedNodeData.node.name_en && (
                <p className="text-text-muted text-xs">{selectedNodeData.node.name_en}</p>
              )}
              {selectedNodeData.node.role_ja && (
                <p className="text-text-secondary text-sm mt-1" lang="ja">{selectedNodeData.node.role_ja}</p>
              )}
              <p className="text-accent text-xs mt-1 uppercase tracking-wider">
                {nodeConfig[selectedNodeData.node.type]?.label || selectedNodeData.node.type}
              </p>
              {selectedNodeData.connections.length > 0 && (
                <div className="mt-3 pt-3 border-t border-black/10">
                  <p className="text-text-muted text-xs mb-1">つながり</p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {selectedNodeData.connections.map(c => c && (
                      <p key={c.node_id} className="text-text-secondary text-xs" lang="ja">
                        {c.name_ja || c.name_en}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Accessible text summary */}
        <p className="sr-only">
          The Tokyo CPB ecosystem connects 5 people, 14 funded organizations, 14 projects, 13 locations, and 4 core concepts through 72 relationships.
        </p>
      </div>
    </section>
  );
}
