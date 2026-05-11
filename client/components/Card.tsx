import React from 'react';
import { Icon } from './Icon';

interface CardProps {
  title: string;
  icon?: string;
  href?: string;
  children?: React.ReactNode;
}

export function Card({ title, icon, href, children }: CardProps) {
  const content = (
    <div className="sd-card">
      {icon && (
        <div className="sd-card-icon">
          <Icon name={icon} size={20} strokeWidth={1.5} />
        </div>
      )}
      <div className="sd-card-body">
        <div className="sd-card-title">{title}</div>
        {children && <div className="sd-card-desc">{children}</div>}
      </div>
    </div>
  );

  if (href) return <a href={href} className="sd-card-link">{content}</a>;
  return content;
}

interface CardGroupProps {
  cols?: number;
  children: React.ReactNode;
}

export function CardGroup({ cols = 2, children }: CardGroupProps) {
  return (
    <div className="sd-card-group" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {children}
    </div>
  );
}
