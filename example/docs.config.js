/** @type {import('supadocs').Config} */
export default {
  name: 'Acme',
  docsDir: 'docs',

  theme: {
    accent: '#6366F1',
  },

  landing: {
    headline: 'Acme Documentation',
    description: 'Everything you need to build with Acme. Guides, API reference, and examples.',
    primaryAction: { label: 'Get Started', href: '/introduction' },
    secondaryAction: { label: 'API Reference', href: '/api/overview' },
    cards: [
      { title: 'Quick Start', description: 'Up and running in under 5 minutes.', icon: 'rocket', href: '/quickstart' },
      { title: 'Authentication', description: 'API keys, OAuth, and JWTs.', icon: 'lock', href: '/guides/authentication' },
      { title: 'SDKs', description: 'TypeScript, Python, and Go clients.', icon: 'code', href: '/api/overview' },
      { title: 'Webhooks', description: 'Real-time event delivery.', icon: 'webhook', href: '/guides/webhooks' },
    ],
  },

  navigation: [
    {
      group: 'Getting Started',
      pages: ['introduction', 'quickstart'],
    },
    {
      group: 'Guides',
      pages: ['guides/authentication', 'guides/webhooks'],
    },
    {
      group: 'API Reference',
      pages: ['api/overview'],
    },
  ],

  links: [
    { label: 'GitHub', href: 'https://github.com', icon: 'github' },
  ],
};
