import React from 'react';
import { Note, Warning, Tip, Info } from 'supadocs/client/components/Callout';
import { Card, CardGroup } from 'supadocs/client/components/Card';
import { CodeBlock } from 'supadocs/client/components/CodeBlock';
import { CodeGroup } from 'supadocs/client/components/CodeGroup';
import { Steps, Step } from 'supadocs/client/components/Steps';
import { Tabs, Tab } from 'supadocs/client/components/Tabs';
import { Accordion } from 'supadocs/client/components/Accordion';

const components = {
  pre: CodeBlock,
  Note,
  Warning,
  Tip,
  Info,
  Card,
  CardGroup,
  CodeGroup,
  Steps,
  Step,
  Tabs,
  Tab,
  Accordion,
};

interface MDXContentProps {
  Component: React.ComponentType<any>;
}

export function MDXContent({ Component }: MDXContentProps) {
  return <Component components={components} />;
}
