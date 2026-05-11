export interface Config {
  name: string;
  logo?: string | { light: string; dark: string };
  favicon?: string;
  docsDir?: string;
  port?: number;
  outDir?: string;

  theme?: {
    accent?: string;
    accentHover?: string;
    font?: string;
    fontHeading?: string;
    fontMono?: string;
    radius?: string;
    colors?: {
      bg?: string;
      bgCard?: string;
      bgSurface?: string;
      text?: string;
      textHeading?: string;
      textMuted?: string;
      border?: string;
    };
    customCss?: string;
  };

  landing?: {
    headline?: string;
    description?: string;
    primaryAction?: { label: string; href: string };
    secondaryAction?: { label: string; href: string };
    cards?: {
      title: string;
      description: string;
      icon?: string;
      href?: string;
    }[];
  };

  navigation?: {
    group: string;
    pages: string[];
  }[];

  tabs?: {
    label: string;
    href: string;
  }[];

  links?: {
    label?: string;
    href: string;
    icon?: string;
  }[];

  footer?: {
    socials?: Record<string, string>;
  };
}
