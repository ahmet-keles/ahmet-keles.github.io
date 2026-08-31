/** Shared shapes for site content. Content lives in data/, never in components. */

export type ProjectStatus = 'shipped' | 'in-development';

/** Coarse buckets used by the filter control on /projects. */
export type ProjectDomain = 'Distributed Systems' | 'Backend' | 'Search & AI' | 'Reliability';

export interface TechTag {
  readonly name: string;
  /** Optional note shown on hover — why this piece is in the stack. */
  readonly note?: string;
}

/** A node in an architecture diagram, positioned on the diagram's viewBox grid. */
export interface DiagramNode {
  readonly id: string;
  readonly label: string;
  readonly sublabel?: string;
  readonly x: number;
  readonly y: number;
  readonly w?: number;
  readonly h?: number;
  readonly kind?: 'service' | 'store' | 'broker' | 'client';
}

export interface DiagramEdge {
  readonly from: string;
  readonly to: string;
  readonly label?: string;
  /** Dashed edges mark asynchronous or best-effort paths. */
  readonly dashed?: boolean;
  /** Nudges the label off the midpoint when edges would otherwise collide. */
  readonly labelDx?: number;
  readonly labelDy?: number;
}

export interface Diagram {
  readonly width: number;
  readonly height: number;
  readonly caption: string;
  readonly nodes: readonly DiagramNode[];
  readonly edges: readonly DiagramEdge[];
}

export interface CaseStudySection {
  readonly id: string;
  readonly heading: string;
  readonly body: readonly string[];
  /** Rendered collapsed behind a disclosure — detail without wall-of-text. */
  readonly collapsible?: boolean;
}

export interface Tradeoff {
  readonly choice: string;
  readonly gained: string;
  readonly cost: string;
}

export interface Project {
  readonly slug: string;
  readonly name: string;
  readonly tagline: string;
  readonly status: ProjectStatus;
  readonly statusLabel: string;
  readonly domains: readonly ProjectDomain[];
  readonly summary: string;
  readonly stack: readonly TechTag[];
  /** Short, checkable capability claims for the card face. */
  readonly capabilities: readonly string[];
  readonly repo: string;
  readonly release?: { readonly label: string; readonly href: string };
  readonly featured: boolean;

  readonly problem: readonly string[];
  readonly diagram: Diagram;
  readonly sections: readonly CaseStudySection[];
  readonly tradeoffs: readonly Tradeoff[];
  readonly testing: readonly string[];
  /** What the project deliberately does not do yet. */
  readonly limitations: readonly string[];
}
