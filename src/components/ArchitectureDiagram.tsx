import type { Diagram, DiagramNode } from '../data/types';
import './ArchitectureDiagram.css';

const DEFAULT_W = 140;
const DEFAULT_H = 60;

const width = (node: DiagramNode) => node.w ?? DEFAULT_W;
const height = (node: DiagramNode) => node.h ?? DEFAULT_H;
const centerX = (node: DiagramNode) => node.x + width(node) / 2;
const centerY = (node: DiagramNode) => node.y + height(node) / 2;

/**
 * Clips a straight line between two node centers to their box edges, so the
 * arrowhead lands on the border instead of disappearing under the shape.
 */
function edgePoints(from: DiagramNode, to: DiagramNode) {
  const x1 = centerX(from);
  const y1 = centerY(from);
  const x2 = centerX(to);
  const y2 = centerY(to);

  const clip = (node: DiagramNode, towardX: number, towardY: number) => {
    const dx = towardX - centerX(node);
    const dy = towardY - centerY(node);
    if (dx === 0 && dy === 0) return { x: centerX(node), y: centerY(node) };
    const halfW = width(node) / 2 + 6;
    const halfH = height(node) / 2 + 6;
    // Scale the direction vector until it first crosses a box edge.
    const scale = Math.min(
      dx === 0 ? Infinity : Math.abs(halfW / dx),
      dy === 0 ? Infinity : Math.abs(halfH / dy),
    );
    return { x: centerX(node) + dx * scale, y: centerY(node) + dy * scale };
  };

  const start = clip(from, x2, y2);
  const end = clip(to, x1, y1);
  return { start, end };
}

export function ArchitectureDiagram({ diagram }: { diagram: Diagram }) {
  const byId = new Map(diagram.nodes.map((n) => [n.id, n]));
  const arrowId = `arrow-${diagram.nodes[0]?.id ?? 'd'}`;

  return (
    <figure className="diagram">
      <div className="diagram-scroll">
        <svg
          viewBox={`0 0 ${diagram.width} ${diagram.height}`}
          className="diagram-svg"
          role="img"
          aria-label={diagram.caption}
        >
          <defs>
            <marker
              id={arrowId}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
            </marker>
          </defs>

          {diagram.edges.map((edge) => {
            const from = byId.get(edge.from);
            const to = byId.get(edge.to);
            if (!from || !to) return null;
            const { start, end } = edgePoints(from, to);
            return (
              <g key={`${edge.from}-${edge.to}-${edge.label ?? ''}`} className="diagram-edge">
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  strokeDasharray={edge.dashed ? '5 4' : undefined}
                  markerEnd={`url(#${arrowId})`}
                />
                {edge.label && (
                  <text
                    x={(start.x + end.x) / 2 + (edge.labelDx ?? 0)}
                    y={(start.y + end.y) / 2 - 6 + (edge.labelDy ?? 0)}
                    textAnchor="middle"
                    className="diagram-edge-label"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {diagram.nodes.map((node) => (
            <g key={node.id} className={`diagram-node kind-${node.kind ?? 'service'}`}>
              <rect x={node.x} y={node.y} width={width(node)} height={height(node)} rx="8" />
              <text
                x={centerX(node)}
                y={node.sublabel ? centerY(node) - 6 : centerY(node) + 4}
                textAnchor="middle"
                className="diagram-node-label"
              >
                {node.label}
              </text>
              {node.sublabel && (
                <text
                  x={centerX(node)}
                  y={centerY(node) + 12}
                  textAnchor="middle"
                  className="diagram-node-sub"
                >
                  {node.sublabel}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
      <figcaption>{diagram.caption}</figcaption>
    </figure>
  );
}
