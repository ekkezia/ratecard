export type TConfig = {
  title: string;
  services: TService;
  color: string;
  notes?: string[]
}

export type TService = {
  [key: string]: {
    title: string;
    description: string;
    price: string;
  }
}

export type TConfigg = {
  title: string;
  services: TServicee;
  color: string;
  notes?: string[]
}

export type TServicee = {
  [key: string]: {
    title: string;
    description: string;
    price: {
      idr: string;
      hkd: string;
      usd: string;
    };
  }
}


export const CONFIG: TConfigg[] = [
  {
    title: 'Photography',
    color: 'black',
    services: {
      '1': {
        title: 'For digital use (concept provided by client)',
        description: '20 edited high res PNG (excluding all raw files)',
        price: {
          idr: '',
          hkd: '',
          usd: '',
        }
      },
      '2': {
        title: 'For digital use (concept not provided by client)',
        description: '20 edited high res PNG (excluding all raw files)',
        price: {
          idr: '',
          hkd: '',
          usd: '',
        }
      },
      '3': {
        title: 'For print + digital use (concept provided by client)',
        description: '20 edited high res PNG (excluding all raw files)',
        price: {
          idr: '',
          hkd: '',
          usd: '',
        }
      },
      '4': {
        title: 'For print + digital use (concept not provided by client)',
        description: '20 edited high res PNG (excluding all raw files)',
        price: {
          idr: '',
          hkd: '',
          usd: '',
        }
      },
      '5': {
        title: 'RAW files',
        description: '',
        price: {
          idr: '',
          hkd: '',
          usd: '',
        }
      },
    },
    notes: ["All prices are negotiable", "All prices are excluding studio, assistant fee, transportation and accommodation costs (if any)."]
  },
  {
    title: 'Web Development',
    color: 'blue',
    services: {
      '1': {
        title: 'Website Design Only',
        description: 'Visual design of website layouts, UI/UX, no development or coding.',
        price: {
          idr: '',
          hkd: '',
          usd: '',
        }
      },
      '2': {
        title: 'Website Development (Static Content)',
        description: 'Development of website with fixed, non-updatable content (no CMS).',
        price: {
          idr: '',
          hkd: '',
          usd: '',
        }
      },
      '3': {
        title: 'Website Development (Dynamic Content))',
        description: 'Development with Content Management System for client to update content independently.',
        price: {
          idr: '',
          hkd: '',
          usd: '',
        }
      },
      '4': {
        title: 'Website Development with 3D Content',
        description: 'Includes interactive or animated 3D elements integrated into the site (using Three.js, Spline, etc.)',
        price: {
          idr: '',
          hkd: '',
          usd: '',
        }
      }
    },
    notes: ["All prices are negotiable."]
  },
]