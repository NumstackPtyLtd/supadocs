import React from 'react';

interface StepsProps {
  children: React.ReactNode;
}

export function Steps({ children }: StepsProps) {
  return <div className="sd-steps">{children}</div>;
}

interface StepProps {
  title: string;
  children: React.ReactNode;
}

export function Step({ title, children }: StepProps) {
  return (
    <div className="sd-step">
      <div className="sd-step-indicator">
        <div className="sd-step-dot" />
        <div className="sd-step-line" />
      </div>
      <div className="sd-step-content">
        <div className="sd-step-title">{title}</div>
        <div className="sd-step-body">{children}</div>
      </div>
    </div>
  );
}
