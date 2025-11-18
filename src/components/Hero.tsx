import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const scrollToOrder = () => {
    const element = document.getElementById('order');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="AI Media Agency Background" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-radial"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-glow-pulse">
          <Sparkles size={16} className="text-accent" />
          <span className="text-sm text-muted-foreground">AI-Powered Media Creation</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Transform Your Brand <br />
          <span className="bg-gradient-flow bg-clip-text text-transparent">
            With AI Artistry
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Professional AI-generated product photography and video ads that captivate your audience. 
          From concept to creation in minutes, not days.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg" onClick={scrollToOrder}>
            Start Your Project <ArrowRight className="ml-2" size={20} />
          </Button>
          <Button variant="outline" size="lg" onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}>
            View Portfolio
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">500+</div>
            <div className="text-sm text-muted-foreground">Projects Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">24h</div>
            <div className="text-sm text-muted-foreground">Average Delivery</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">AI-Powered</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
