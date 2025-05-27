
import Sidebar from '../components/Sidebar';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Apps from '../components/Apps';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      
      <main className="flex-1 md:ml-64">
        {/* Main content */}
        <Hero />
        <About />
        <Projects />
        <Apps />
        <Contact />
        <Footer />
      </main>
    </div>
  );
};

export default Index;
