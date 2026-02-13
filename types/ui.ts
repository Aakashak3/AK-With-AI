/**
 * UI Component Type Definitions
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface CTAButton {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

export interface FooterSection {
  title: string;
  links: NavLink[];
}

export interface SocialLink {
  icon: string;
  href: string;
  label: string;
}
