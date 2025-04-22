type TConfig = {
  title: string;
  services: TService[];
  color: string;
  notes?: string[]
}

export type TService = {
    title: string;
    description: string;
    price: string;
}

export const CONFIG: TConfig[] = [
  {
    title: 'Photography',
    color: 'black',
    services: [
      {
        title: 'For digital use (concept provided by client)',
        description: '20 edited high res PNG (excluding all raw files)',
        price: '6,000mio'
      },
      {
        title: 'For digital use (concept not provided by client)',
        description: '20 edited high res PNG (excluding all raw files)',
        price: '10,000mio'
      },
      {
        title: 'For print + digital use (concept provided by client)',
        description: '20 edited high res PNG (excluding all raw files)',
        price: '17,000mio'
      },
      {
        title: 'For print + digital use (concept not provided by client)',
        description: '20 edited high res PNG (excluding all raw files)',
        price: '20,000mio'
      },
      {
        title: 'RAW files',
        description: '',
        price: '3,000mio'
      },
    ],
    notes: ["All prices are negotiable", "All prices are excluding studio, assistant fee, transportation and accommodation costs (if any)."]
  },
  {
    title: 'Web Development',
    color: 'blue',
    services: [
      {
        title: 'Website Design Only',
            description: 'Visual design of website layouts, UI/UX, no development or coding.',
            price: '5,000mio'
      },
      {
        title: 'Website Development (Static Content)',
            description: 'Development of website with fixed, non-updatable content (no CMS).',
            price: '8,000mio'
      },
      {
        title: 'Website Design Only',
            description: 'Development with content management system for client to update content independently.',
            price: '10,000mio'
      },
      {
        title: 'Website Development with 3D Content',
            description: 'Includes interactive or animated 3D elements integrated into the site (using Three.js, Spline, etc.)',
            price: '17,000mio'
      }
    ],
    notes: ["All prices are negotiable."]

  },
]