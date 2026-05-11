import React from 'react';
import { Info as InfoIcon, AlertTriangle, Lightbulb, CircleAlert } from 'lucide-react';

type CalloutType = 'note' | 'warning' | 'tip' | 'info';

const iconMap: Record<CalloutType, React.ReactNode> = {
  note: <CircleAlert size={16} strokeWidth={2} />,
  warning: <AlertTriangle size={16} strokeWidth={2} />,
  tip: <Lightbulb size={16} strokeWidth={2} />,
  info: <InfoIcon size={16} strokeWidth={2} />,
};

function Callout({ type = 'note', children }: { type?: CalloutType; children: React.ReactNode }) {
  return (
    <div className={`sd-callout sd-callout-${type}`}>
      <div className="sd-callout-icon">{iconMap[type]}</div>
      <div className="sd-callout-content">{children}</div>
    </div>
  );
}

export function Note({ children }: { children: React.ReactNode }) { return <Callout type="note">{children}</Callout>; }
export function Warning({ children }: { children: React.ReactNode }) { return <Callout type="warning">{children}</Callout>; }
export function Tip({ children }: { children: React.ReactNode }) { return <Callout type="tip">{children}</Callout>; }
export function Info({ children }: { children: React.ReactNode }) { return <Callout type="info">{children}</Callout>; }
