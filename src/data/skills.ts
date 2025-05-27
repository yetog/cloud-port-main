
export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'technical' | 'cloud' | 'soft';
}

export const skills: Skill[] = [
  // Technical Skills
  { name: 'Cloud Architecture', level: 95, category: 'technical' },
  { name: 'Network Infrastructure', level: 90, category: 'technical' },
  { name: 'Linux', level: 85, category: 'technical' },
  { name: 'Web Development', level: 75, category: 'technical' },
  
  // Cloud Platforms
  { name: 'IONOS', level: 90, category: 'cloud' },
  { name: 'Azure', level: 85, category: 'cloud' },
  { name: 'Google Cloud', level: 75, category: 'cloud' },
  { name: 'AWS', level: 75, category: 'cloud' },
  
  // Soft Skills
  { name: 'Solution Design', level: 95, category: 'soft' },
  { name: 'Data Analaytics', level: 90, category: 'soft' },
  { name: 'Project Management', level: 85, category: 'soft' },
];
