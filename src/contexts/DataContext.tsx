import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import sample1 from "@/assets/sample-1.jpg";
import sample2 from "@/assets/sample-2.jpg";
import sample3 from "@/assets/sample-3.jpg";
import sample4 from "@/assets/sample-4.jpg";

export interface ContactInfo {
  phone: string;
  phoneAction: string;
  email: string;
  emailAction: string;
}

export interface SocialLink {
  name: string;
  url: string;
}

export interface PortfolioItem {
  id: string;
  type: "image" | "video";
  src: string;
  alt: string;
  thumbnail?: string;
}

export interface FooterLinks {
  privacyPolicy: string;
  termsOfService: string;
}

interface DataContextType {
  contactInfo: ContactInfo;
  socials: SocialLink[];
  portfolio: PortfolioItem[];
  footerLinks: FooterLinks;
  calendlyLink: string;
  updateContactInfo: (info: ContactInfo) => void;
  updateSocials: (socials: SocialLink[]) => void;
  addPortfolioItem: (item: PortfolioItem) => void;
  removePortfolioItem: (id: string) => void;
  updateFooterLinks: (links: FooterLinks) => void;
  updateCalendlyLink: (link: string) => void;
}

const defaultContactInfo: ContactInfo = {
  phone: "+216 XX XXX XXX",
  phoneAction: "tel:+216XXXXXXXX",
  email: "hello@flowai.tn",
  emailAction: "mailto:hello@flowai.tn",
};

const defaultSocials: SocialLink[] = [
  { name: "Instagram", url: "#" },
  { name: "Facebook", url: "#" },
  { name: "LinkedIn", url: "#" },
];

const defaultPortfolio: PortfolioItem[] = [
  { id: "1", type: "image", src: sample1, alt: "Luxury perfume product photography" },
  { id: "2", type: "image", src: sample2, alt: "Modern sneakers with holographic effects" },
  { id: "3", type: "image", src: sample3, alt: "Premium watch with light trails" },
  { id: "4", type: "image", src: sample4, alt: "Cosmetics with flowing liquid effects" },
];

const defaultFooterLinks: FooterLinks = {
  privacyPolicy: "#",
  termsOfService: "#",
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [socials, setSocials] = useState<SocialLink[]>(defaultSocials);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(defaultPortfolio);
  const [footerLinks, setFooterLinks] = useState<FooterLinks>(defaultFooterLinks);
  const [calendlyLink, setCalendlyLink] = useState<string>("https://calendly.com");

  useEffect(() => {
    // Load data from localStorage
    const storedContact = localStorage.getItem("contactInfo");
    const storedSocials = localStorage.getItem("socials");
    const storedPortfolio = localStorage.getItem("portfolio");
    const storedFooterLinks = localStorage.getItem("footerLinks");
    const storedCalendly = localStorage.getItem("calendlyLink");

    if (storedContact) setContactInfo(JSON.parse(storedContact));
    if (storedSocials) setSocials(JSON.parse(storedSocials));
    if (storedPortfolio) setPortfolio(JSON.parse(storedPortfolio));
    if (storedFooterLinks) setFooterLinks(JSON.parse(storedFooterLinks));
    if (storedCalendly) setCalendlyLink(storedCalendly);
  }, []);

  const updateContactInfo = (info: ContactInfo) => {
    setContactInfo(info);
    localStorage.setItem("contactInfo", JSON.stringify(info));
  };

  const updateSocials = (newSocials: SocialLink[]) => {
    setSocials(newSocials);
    localStorage.setItem("socials", JSON.stringify(newSocials));
  };

  const addPortfolioItem = (item: PortfolioItem) => {
    const newPortfolio = [...portfolio, item];
    setPortfolio(newPortfolio);
    localStorage.setItem("portfolio", JSON.stringify(newPortfolio));
  };

  const removePortfolioItem = (id: string) => {
    const newPortfolio = portfolio.filter((item) => item.id !== id);
    setPortfolio(newPortfolio);
    localStorage.setItem("portfolio", JSON.stringify(newPortfolio));
  };

  const updateFooterLinks = (links: FooterLinks) => {
    setFooterLinks(links);
    localStorage.setItem("footerLinks", JSON.stringify(links));
  };

  const updateCalendlyLink = (link: string) => {
    setCalendlyLink(link);
    localStorage.setItem("calendlyLink", link);
  };

  return (
    <DataContext.Provider
      value={{
        contactInfo,
        socials,
        portfolio,
        footerLinks,
        calendlyLink,
        updateContactInfo,
        updateSocials,
        addPortfolioItem,
        removePortfolioItem,
        updateFooterLinks,
        updateCalendlyLink,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

