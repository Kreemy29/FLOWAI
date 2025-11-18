import { useData } from "@/contexts/DataContext";

const Footer = () => {
  const { footerLinks } = useData();

  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-2xl font-bold bg-gradient-flow bg-clip-text text-transparent">
            FLOW AI
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 FLOW AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href={footerLinks.privacyPolicy} className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href={footerLinks.termsOfService} className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
