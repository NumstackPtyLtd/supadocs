# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2026-05-17

### Added
- Versioned docs: `versions` config, version dropdown in header, version banner on old pages
- `supadocs snapshot <label>` command to freeze current docs as a version
- Version-specific accent colour override
- Site-wide banner: `banner` config with text, href, and dismissible support
- Version-scoped navigation: all links (logo, tabs, sidebar, footer) stay within the active version
- Scroll to top on page navigation
- Tab component reads `title` prop (in addition to `label`)
- Equal height cards in CardGroup

### Fixed
- Static assets (logo, fonts, favicon) copied to build output
- Copy favicon.svg, favicon.png, favicon.ico to dist

## [0.1.7] - 2026-05-17

### Fixed
- Copy static assets (logo, fonts, favicon) to build output

## [0.1.3] - 2026-05-12

### Added
- Initial release
- Custom documentation framework for SupaProxy docs
