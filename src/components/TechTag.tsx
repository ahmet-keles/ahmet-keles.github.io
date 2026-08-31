import type { TechTag as Tech } from '../data/types';
import './TechTag.css';

/** A single technology chip. `note` becomes a native tooltip when present. */
export function TechTag({ tech }: { tech: Tech }) {
  return (
    <li className="tech-tag" {...(tech.note ? { title: tech.note } : {})}>
      {tech.name}
    </li>
  );
}

export function TechTagList({ items }: { items: readonly Tech[] }) {
  return (
    <ul className="tech-tags">
      {items.map((tech) => (
        <TechTag key={tech.name} tech={tech} />
      ))}
    </ul>
  );
}
