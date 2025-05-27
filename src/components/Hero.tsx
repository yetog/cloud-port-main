
import { ArrowDown } from 'lucide-react';

const Hero = () => {
  return (
    <div className="min-h-screen flex items-center relative">
      <div className="container mx-auto px-4 py-10 md:py-20">
        <div className="max-w-4xl mx-auto text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-fade-in">
            Isayah Young-Burke
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Infrastructure & Cloud Consultant
          </p>
          <p className="mt-4 text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Helping companies modernize systems, scale efficiently, and move confidently into the future.
          </p>
          <div className="mt-10 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <a 
              href="#about" 
              className="button-primary inline-flex items-center"
            >
              Learn more
              <ArrowDown className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background -z-10 pointer-events-none"></div>
    </div>
  );
};

export default Hero;
