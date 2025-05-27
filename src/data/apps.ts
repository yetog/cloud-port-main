
export interface App {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  appUrl?: string;
  storeUrl?: string;
}

export const apps: App[] = [
  {
    id: 'meditation',
    title: 'Meditation App',
    description: 'A minimalist meditation app with customizable ambient sounds and interval timers.',
    image: '/placeholder.svg',
    tags: ['Web App', 'PWA', 'React'],
    appUrl: 'https://zaylegend.com/meditation/',
  },
  {
    id: 'magic-stream',
    title: 'Magic Stream',
    description: 'A looping background music experience for studying, creating, and relaxing.',
    image: '/placeholder.svg',
    tags: ['Web App', 'Audio', 'Streaming'],
    appUrl: 'https://zaylegend.com/magic-stream/',
  },
  {
    id: 'playful-space-arcade-main',
    title: 'Playful Space Arcade',
    description: 'A fast-paced, arcade-style space shooter to test your reflexes and score high!',
    image: '/placeholder.svg',
    tags: ['Game', 'Arcade', 'Vite'],
    appUrl: 'https://zaylegend.com/playful-space-arcade-main/',
  },
  {
    id: 'wolf-of-ny',
    title: 'Wolf of NY',
    description: 'A cinematic landing page inspired by classic finance and NYC aesthetics.',
    image: '/placeholder.svg',
    tags: ['Landing Page', 'Finance', 'Design'],
    appUrl: 'https://zaylegend.com/wolf-of-ny/',
  }
];
