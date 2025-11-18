import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Video, Zap } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Camera,
      title: "Photo Posts",
      price: "50 TND",
      includes: "4 Professional Photos",
      extra: "+10 TND per additional photo",
      description: "AI-generated product photography with professional photoshoot quality",
      features: ["High-resolution images", "Studio lighting effects", "Multiple angles", "Brand consistency"]
    },
    {
      icon: Video,
      title: "Video Posts",
      price: "100 TND",
      includes: "Professional Video Ad",
      description: "Dynamic AGC videos that bring your products to life",
      features: ["Motion graphics", "Professional editing", "Music & effects", "Platform-optimized"]
    }
  ];

  const scrollToOrder = () => {
    const element = document.getElementById('order');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-24 bg-gradient-radial">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Zap size={16} className="text-accent" />
            <span className="text-sm text-muted-foreground">Our Services</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Pricing That <span className="bg-gradient-flow bg-clip-text text-transparent">Flows</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional AI-powered media creation at transparent, affordable prices
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="bg-card/50 backdrop-blur-sm border-border hover:border-primary transition-all duration-300 hover:shadow-glow"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <service.icon className="text-primary-foreground" size={24} />
                </div>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-4xl font-bold text-primary mb-1">{service.price}</div>
                  <div className="text-sm text-muted-foreground">{service.includes}</div>
                  {service.extra && (
                    <div className="text-xs text-accent mt-1">{service.extra}</div>
                  )}
                </div>
                
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button variant="hero" className="w-full" onClick={scrollToOrder}>
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
