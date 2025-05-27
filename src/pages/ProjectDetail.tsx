
import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { ArrowLeft, ExternalLink, Code, Cloud, Globe, Image, Headphones } from 'lucide-react';

const categoryIcons = {
  cloud: <Cloud className="h-6 w-6" />,
  webhosting: <Globe className="h-6 w-6" />,
  artcurating: <Image className="h-6 w-6" />,
  audioengineering: <Headphones className="h-6 w-6" />
};

const categoryTitles = {
  cloud: 'Cloud Infrastructure',
  webhosting: 'Web Hosting',
  artcurating: 'Art Curation',
  audioengineering: 'Audio Engineering'
};

const ProjectDetail = () => {
  const { projectId } = useParams();
  
  // Find the project with the matching ID
  const project = projects.find((p) => p.id === projectId);
  
  // If project not found, show a message
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <Link to="/#projects" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2" />
          Back to Projects
        </Link>
      </div>
    );
  }

  // Render project details if found
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        <Link 
          to="/#projects" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
        
        <div className="glass-panel p-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            {categoryIcons[project.category as keyof typeof categoryIcons]}
            <span className="text-lg text-muted-foreground">
              {categoryTitles[project.category as keyof typeof categoryTitles]}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{project.title}</h1>
          
          <div className="aspect-video w-full bg-muted mb-8 rounded-lg overflow-hidden">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <p className="text-muted-foreground mb-6">{project.description}</p>
            
            {/* This would be expanded content for the detail page */}
            <p className="text-muted-foreground mb-6">
              This project showcases my expertise in {project.category === 'cloud' ? 'cloud infrastructure' : 
                project.category === 'webhosting' ? 'web hosting solutions' : 
                project.category === 'artcurating' ? 'art curation' : 'audio engineering'}.
              The implementation involved careful planning, technical execution, and client collaboration.
            </p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-3 py-1.5 rounded-full bg-primary/10 text-primary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {project.demoUrl && (
              <a 
                href={project.demoUrl}
                className="button-primary flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={18} className="mr-2" />
                View Demo
              </a>
            )}
            {project.codeUrl && (
              <a 
                href={project.codeUrl}
                className="flex items-center border border-primary text-primary px-4 py-2 rounded-lg
                          hover:bg-primary/10 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code size={18} className="mr-2" />
                View Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
