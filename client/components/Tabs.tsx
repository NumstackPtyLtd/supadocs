import React, { useState, Children, isValidElement } from 'react';

interface TabsProps {
  children: React.ReactNode;
}

export function Tabs({ children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs: { label: string; content: React.ReactNode }[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child) && (child.type as any) === Tab) {
      const props = child.props as any;
      tabs.push({ label: props.label || `Tab ${tabs.length + 1}`, content: props.children });
    }
  });

  if (tabs.length === 0) return <>{children}</>;

  return (
    <div className="sd-tabs">
      <div className="sd-tabs-header">
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={`sd-tabs-btn ${i === activeTab ? 'sd-tabs-btn-active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="sd-tabs-content">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
}

interface TabProps {
  label: string;
  children: React.ReactNode;
}

export function Tab({ children }: TabProps) {
  return <>{children}</>;
}
