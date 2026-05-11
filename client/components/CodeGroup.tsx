import React, { useState, Children, isValidElement } from 'react';

interface CodeGroupProps {
  children: React.ReactNode;
}

export function CodeGroup({ children }: CodeGroupProps) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs: { label: string; content: React.ReactNode }[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.props) {
      // Extract language from className (e.g., "language-bash") or title prop
      const props = child.props as any;
      let label = props.title || props['data-language'] || '';

      // If the child is a pre > code structure
      if (props.children && isValidElement(props.children)) {
        const codeProps = (props.children as React.ReactElement).props as any;
        const className = codeProps?.className || '';
        const langMatch = className.match(/language-(\w+)/);
        if (langMatch) label = label || langMatch[1];
      }

      tabs.push({ label: label || `Tab ${tabs.length + 1}`, content: child });
    }
  });

  if (tabs.length === 0) return <>{children}</>;

  return (
    <div className="sd-code-group">
      <div className="sd-code-group-tabs">
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={`sd-code-group-tab ${i === activeTab ? 'sd-code-group-tab-active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="sd-code-group-content">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
}
