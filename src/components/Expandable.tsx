import { useId, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import './Expandable.css';

interface Props {
  readonly summary: string;
  readonly children: React.ReactNode;
  readonly defaultOpen?: boolean;
}

/**
 * Disclosure built on a button + region rather than <details>, so the
 * open state is React-controlled and the chevron can animate.
 */
export function Expandable({ summary, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className={`expandable${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="expandable-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
      >
        <ChevronRight size={16} className="expandable-chevron" aria-hidden />
        <span>{summary}</span>
      </button>
      <div id={id} className="expandable-panel" hidden={!open}>
        {children}
      </div>
    </div>
  );
}
