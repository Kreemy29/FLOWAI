import { useState } from "react";
import { Eye } from "lucide-react";
import { useData } from "@/contexts/DataContext";

const Portfolio = () => {
  const [selectedItem, setSelectedItem] = useState<{ src: string; type: "image" | "video" } | null>(null);
  const { portfolio } = useData();

  return (
    <section id="portfolio" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Eye size={16} className="text-accent" />
            <span className="text-sm text-muted-foreground">Our Work</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            AI-Crafted <span className="bg-gradient-flow bg-clip-text text-transparent">Excellence</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how we transform ordinary products into extraordinary visual experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolio.map((item) => (
            <div 
              key={item.id}
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setSelectedItem({ src: item.src, type: item.type })}
            >
              {item.type === "image" ? (
                <img 
                  src={item.src} 
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <video 
                  src={item.src}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  muted
                />
              )}
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center">
                <Eye size={32} className="text-primary-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          {selectedItem.type === "image" ? (
            <img 
              src={selectedItem.src} 
              alt="Portfolio item" 
              className="max-w-full max-h-full rounded-lg shadow-glow"
            />
          ) : (
            <video 
              src={selectedItem.src}
              className="max-w-full max-h-full rounded-lg shadow-glow"
              controls
              autoPlay
            />
          )}
        </div>
      )}
    </section>
  );
};

export default Portfolio;
