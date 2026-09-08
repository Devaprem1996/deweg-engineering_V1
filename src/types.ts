export interface ReferenceAsset {
  id: string;
  type: 'image' | 'video' | 'gif';
  title: string;
  caption?: string;
  url: string;
  posterUrl?: string;
  fileName?: string;
  resolution?: string;
}

export interface Service {
  id: string;
  number: string;
  title: string;
  officialCode?: string;
  tagline: string;
  description: string;
  referencePhilosophy?: string;
  detailedScope: string[];
  deliverables: string[];
  icon: string;
  svgIconUrl?: string;
  image: string;
  referenceAssets?: ReferenceAsset[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  location: string;
  client: string;
  image: string;
  summary: string;
  fullDescription: string;
  keyStats: {
    label: string;
    value: string;
  }[];
  disciplines: string[];
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  detail: string;
}

export interface TeamMember {
  name: string;
  role: string;
  credentials?: string;
  bio: string;
  specialty?: string;
  image?: string;
  secondaryRole?: string;
  experience?: string;
  education?: string;
  leadershipStatement?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  clientName: string;
  clientRole: string;
  company: string;
  project: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
}
