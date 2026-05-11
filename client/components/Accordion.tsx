import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`sd-accordion ${open ? 'sd-accordion-open' : ''}`}>
      <button className="sd-accordion-trigger" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          className="sd-accordion-chevron"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="sd-accordion-content">{children}</div>}
    </div>
  );
}
