import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, Instagram, Facebook, Linkedin, Calendar } from "lucide-react";

const Contact = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      value: "+216 XX XXX XXX",
      action: "tel:+216XXXXXXXX"
    },
    {
      icon: Mail,
      title: "Email Us",
      value: "hello@flowai.tn",
      action: "mailto:hello@flowai.tn"
    }
  ];

  const socials = [
    { icon: Instagram, name: "Instagram", url: "#" },
    { icon: Facebook, name: "Facebook", url: "#" },
    { icon: Linkedin, name: "LinkedIn", url: "#" }
  ];

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Calendar size={16} className="text-accent" />
            <span className="text-sm text-muted-foreground">Get In Touch</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Let's <span className="bg-gradient-flow bg-clip-text text-transparent">Connect</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to transform your brand? Reach out through any channel
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border hover:border-primary transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                    <method.icon className="text-primary-foreground" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                  <a 
                    href={method.action}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {method.value}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-border text-center p-8">
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex justify-center gap-4">
              {socials.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="w-12 h-12 rounded-full bg-secondary hover:bg-gradient-primary flex items-center justify-center transition-all duration-300 hover:shadow-glow group"
                  aria-label={social.name}
                >
                  <social.icon className="text-foreground group-hover:text-primary-foreground transition-colors" size={20} />
                </a>
              ))}
            </div>
          </Card>

          <div className="mt-8 text-center">
            <Button variant="hero" size="lg" onClick={() => window.open('https://calendly.com', '_blank')}>
              <Calendar className="mr-2" size={20} />
              Book a Call
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
