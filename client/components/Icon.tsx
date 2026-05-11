import React from 'react';
import * as icons from 'lucide-react';

type LucideIcon = React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

const iconCache = new Map<string, LucideIcon>();

function pascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

export function Icon({ name, size = 18, strokeWidth = 1.75, className }: {
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  if (!name) return null;

  let IconComponent = iconCache.get(name);
  if (!IconComponent) {
    const key = pascalCase(name);
    IconComponent = (icons as any)[key] as LucideIcon | undefined;
    if (IconComponent) {
      iconCache.set(name, IconComponent);
    }
  }

  if (!IconComponent) return null;

  return <IconComponent size={size} strokeWidth={strokeWidth} className={className} />;
}
