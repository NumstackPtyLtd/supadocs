import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface VersionBannerProps {
  version: string;
  currentLabel: string;
}

export function VersionBanner({ version, currentLabel }: VersionBannerProps) {
  return (
    <div className="sd-version-banner">
      <AlertTriangle size={14} />
      <span>
        You are viewing docs for <strong>{version}</strong>.{' '}
        <a href="/">Switch to {currentLabel}</a>
      </span>
    </div>
  );
}
