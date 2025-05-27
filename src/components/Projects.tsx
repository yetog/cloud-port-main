
import { useState, useEffect, useRef } from 'react';
import { projects } from '../data/projects';
import { ExternalLink, Code, Cloud, Globe, Image as ImageIcon, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

// Project category types and their corresponding icons
const categoryIcons = {
  cloud: <Cloud className="h-5 w-5" />,
  webhosting: <Globe className="h-5 w-5" />,
  artcurating: <ImageIcon className="h-5 w-5" />,
  audioengineering: <Headphones className="h-5 w-5" />
};

const categoryTitles = {
  cloud: 'Cloud Infrastructure',
  webhosting: 'Web Hosting',
  artcurating: 'Art Curation',
  audioengineering: 'Audio Engineering'
};

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('cloud');
  const [loaded, setLoaded] = useState(false);

  // Get unique categories from projects
  const categories = [...new Set(projects.map(project => project.category))];

  // Filter projects based on active category
  const filteredProjects = projects.filter(project => project.category === activeCategory);

  useEffect(() => {
    // Delay to coordinate with animations if desired
    const timer = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  return (
    <section id="projects" className="py-20 md:py-28 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">Projects</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mb-12">
            Here are selected infrastructure and hosting projects I've helped develop or manage. From scalable server architectures to sleek, client-ready websites — each project reflects a blend of efficiency, modern design, and long-term sustainability.
          </p>
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80 text-muted-foreground'
                }`}
              >
                {categoryIcons[category as keyof typeof categoryIcons]}
                {categoryTitles[category as keyof typeof categoryTitles]}
              </button>
            ))}
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
              skipSnaps: false,
              dragFree: false,
            }}
            className="w-full"
          >
            <CarouselContent>
              {filteredProjects.map((project, index) => (
                <CarouselItem 
                  key={project.id} 
                  className="basis-full md:basis-1/2 p-2"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div 
                    className={`glass-panel p-6 h-full transition-all duration-700 ${
                      loaded ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    <div className="aspect-video w-full bg-muted mb-4 rounded overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {categoryIcons[project.category as keyof typeof categoryIcons]}
                      <span className="text-sm text-muted-foreground">
                        {categoryTitles[project.category as keyof typeof categoryTitles]}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4 mt-4">
                      <Link
                        to={`/projects/${project.id}`}
                        className="flex items-center text-sm text-primary hover:underline"
                      >
                        <ExternalLink size={16} className="mr-1" />
                        View Details
                      </Link>
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          className="flex items-center text-sm text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink size={16} className="mr-1" />
                          View Demo
                        </a>
                      )}
                      {project.codeUrl && (
                        <a
                          href={project.codeUrl}
                          className="flex items-center text-sm text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Code size={16} className="mr-1" />
                          View Code
                        </a>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-6">
              <CarouselPrevious className="static translate-y-0 mr-4" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Projects;
