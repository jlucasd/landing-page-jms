import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Diferencial {
  title: string;
  description: string;
  icon: LucideIcon;
}

/** Frame do track horizontal da seção "Jetski" (modelo ou destaque) */
export interface JetskiFrame {
  type: 'model' | 'quote';
  name?: string;   // type === 'model'
  spec?: string;   // type === 'model'
  image?: string;  // type === 'model'
  alt?: string;    // type === 'model'
  quote?: string;  // type === 'quote'
  highlight?: string; // trecho destacado do quote
}

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  area: string; // grid-area
}

export interface LocalNavegacao {
  name: string;
  description: string;
  image: string;
  alt: string;
  mapUrl: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  name: string;
  text: string;
}

export interface TeamMember {
  initial: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  /** object-position do recorte da foto (para enquadrar o rosto) */
  focus?: string;
}

export interface InstagramPost {
  image: string;
  permalink: string;
  caption: string;
}
