
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: 'cloud' | 'webhosting' | 'artcurating' | 'audioengineering';
  demoUrl?: string;
  codeUrl?: string;
}

export const projects: Project[] = [
  // Cloud Infrastructure (3+)
  {
    id: 'cloud-migration',
    title: 'Enterprise Cloud Migration',
    description: 'Led the migration of a legacy infrastructure to AWS, resulting in 40% cost reduction and improved scalability.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    tags: ['AWS', 'Migration', 'Infrastructure'],
    category: 'cloud',
    demoUrl: '#',
  },
  {
    id: 'devops-pipeline',
    title: 'CI/CD Pipeline Optimization',
    description: 'Designed and implemented automated deployment pipelines reducing deployment time from days to minutes.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    tags: ['DevOps', 'CI/CD', 'Jenkins', 'GitHub Actions'],
    category: 'cloud',
    demoUrl: '#',
  },
  {
    id: 'cloud-security',
    title: 'Cloud Security Framework',
    description: 'Implemented enterprise-grade cloud security policies, automating compliance checks across resources.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    tags: ['Security', 'Compliance', 'Automation'],
    category: 'cloud',
    demoUrl: '#',
  },
  // Web Hosting (3+)
  {
    id: 'scalable-architecture',
    title: 'Scalable Web Architecture',
    description: 'Architected a high-availability solution handling 10M+ daily requests with 99.99% uptime.',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
    tags: ['Cloud Architecture', 'Load Balancing', 'AWS'],
    category: 'webhosting',
    demoUrl: '#',
  },
  {
    id: 'serverless-api',
    title: 'Serverless API Platform',
    description: 'Built a cost-effective serverless platform connecting multiple data sources with auto-scaling capabilities.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
    tags: ['Serverless', 'Lambda', 'API Gateway'],
    category: 'webhosting',
    demoUrl: '#',
  },
  {
    id: 'nextjs-hosting',
    title: 'Next.js Hosting & Deployment',
    description: 'Developed an automated solution for deploying, scaling, and monitoring Next.js apps worldwide.',
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    tags: ['Next.js', 'Vercel', 'Web Hosting'],
    category: 'webhosting',
    demoUrl: '#',
  },
  // Art Curation (3+)
  {
    id: 'art-exhibition',
    title: 'Digital Art Exhibition',
    description: 'Curated and hosted a virtual gallery featuring interactive digital art pieces from emerging artists.',
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
    tags: ['Virtual Gallery', 'Digital Art', 'Curation'],
    category: 'artcurating',
    demoUrl: '#',
  },
  {
    id: 'mixed-media-salon',
    title: 'Mixed Media Art Salon',
    description: 'Produced an experimental salon bringing together digital, video, and installation artists.',
    image: 'https://images.unsplash.com/photo-1473091534298-04dcbce3278c',
    tags: ['Exhibition', 'Salon', 'Art Curating'],
    category: 'artcurating',
    demoUrl: '#',
  },
  {
    id: 'gallery-tech',
    title: 'Interactive Gallery Tech',
    description: 'Engineered interactive touchscreen displays for in-person digital art experiences.',
    image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334',
    tags: ['Interactive', 'Gallery', 'Technology'],
    category: 'artcurating',
    demoUrl: '#',
  },
  // Audio Engineering (3+)
  {
    id: 'music-production',
    title: 'Album Production Suite',
    description: 'Designed a cloud-based workflow for remote music production teams, enabling seamless collaboration.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    tags: ['Audio Production', 'Cloud Workflow', 'Collaboration'],
    category: 'audioengineering',
    demoUrl: '#',
  },
  {
    id: 'remote-mix',
    title: 'Remote Live Mix',
    description: 'Engineered a low-latency remote mix session for a global live concert broadcast.',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9',
    tags: ['Live Sound', 'Remote Mixing', 'Streaming'],
    category: 'audioengineering',
    demoUrl: '#',
  },
  {
    id: 'immersive-audio',
    title: 'Immersive Audio Install',
    description: 'Built a 3D spatial audio soundscape for a modern art museum room.',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86',
    tags: ['Spatial Audio', 'Installation', 'Sound Design'],
    category: 'audioengineering',
    demoUrl: '#',
  },
];
