
import { apps } from '../data/apps';
import { ExternalLink, Download } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const Apps = () => {
  return (
    <section id="apps" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">Apps</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mb-12">
            I've also created custom tools and platforms designed to enhance productivity, creativity, and digital workflows. These personal apps reflect my passion for automation, cloud integration, and user-first design.
          </p>
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
              {apps.map((app, index) => (
                <CarouselItem
                  key={app.id}
                  className="basis-full md:basis-1/4 p-2"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div
                    className="glass-panel p-5 flex flex-col h-full transition-all duration-500 opacity-100 transform-none"
                  >
                    <div className="w-16 h-16 rounded-xl mb-4 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <img
                        src={app.image}
                        alt={app.title}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{app.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{app.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {app.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-auto pt-3">
                      {app.appUrl && (
                        <a
                          href={app.appUrl}
                          className="flex items-center text-xs text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink size={14} className="mr-1" />
                          Open App
                        </a>
                      )}
                      {app.storeUrl && (
                        <a
                          href={app.storeUrl}
                          className="flex items-center text-xs text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download size={14} className="mr-1" />
                          Download
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

export default Apps;
