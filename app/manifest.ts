import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VIHARA — Discover India\'s Hidden Gems',
    short_name: 'VIHARA',
    description: 'AI-powered platform to discover offbeat, hidden gem destinations across India',
    start_url: '/en',
    display: 'standalone',
    background_color: '#080C0C',
    theme_color: '#C9965A',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
  };
}
