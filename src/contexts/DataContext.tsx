import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import sample1 from "@/assets/sample-1.jpg";
import sample2 from "@/assets/sample-2.jpg";
import sample3 from "@/assets/sample-3.jpg";
import sample4 from "@/assets/sample-4.jpg";
import { getSiteData, saveSiteData, isSupabaseAvailable } from "@/services/supabase";

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
  updateContactInfo: (info: ContactInfo) => Promise<boolean>;
  updateSocials: (socials: SocialLink[]) => Promise<boolean>;
  addPortfolioItem: (item: PortfolioItem) => Promise<boolean>;
  removePortfolioItem: (id: string) => Promise<boolean>;
  updateFooterLinks: (links: FooterLinks) => Promise<boolean>;
  updateCalendlyLink: (link: string) => Promise<boolean>;
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
    const loadData = async () => {
      console.log('🔄 Loading data...');
      
      // Try to load from Supabase first (shared data)
      if (isSupabaseAvailable()) {
        console.log('📡 Supabase is available, attempting to load data...');
        const supabaseData = await getSiteData();
        console.log('📦 Data from Supabase:', supabaseData);
        
        if (supabaseData && Object.keys(supabaseData).length > 0) {
          // Merge Supabase data with defaults (Supabase data takes priority)
          if (supabaseData.contactInfo) {
            console.log('✅ Loading contactInfo from Supabase');
            setContactInfo(supabaseData.contactInfo);
          }
          if (supabaseData.socials && Array.isArray(supabaseData.socials)) {
            console.log('✅ Loading socials from Supabase');
            setSocials(supabaseData.socials);
          }
          if (supabaseData.portfolio && Array.isArray(supabaseData.portfolio)) {
            console.log('✅ Loading portfolio from Supabase');
            setPortfolio(supabaseData.portfolio);
          }
          if (supabaseData.footerLinks) {
            console.log('✅ Loading footerLinks from Supabase');
            setFooterLinks(supabaseData.footerLinks);
          }
          if (supabaseData.calendlyLink) {
            console.log('✅ Loading calendlyLink from Supabase');
            setCalendlyLink(supabaseData.calendlyLink);
          }
          
          // Also save to localStorage as backup
          if (supabaseData.contactInfo) localStorage.setItem("contactInfo", JSON.stringify(supabaseData.contactInfo));
          if (supabaseData.socials) localStorage.setItem("socials", JSON.stringify(supabaseData.socials));
          if (supabaseData.portfolio) localStorage.setItem("portfolio", JSON.stringify(supabaseData.portfolio));
          if (supabaseData.footerLinks) localStorage.setItem("footerLinks", JSON.stringify(supabaseData.footerLinks));
          if (supabaseData.calendlyLink) localStorage.setItem("calendlyLink", supabaseData.calendlyLink);
          
          console.log('✅ Data loaded from Supabase successfully');
          return; // If Supabase has data, use it and skip localStorage fallback
        } else {
          console.log('⚠️ Supabase returned empty data, falling back to localStorage');
        }
      } else {
        console.log('⚠️ Supabase not available, using localStorage');
      }

      // Fallback to localStorage (for backward compatibility and if Supabase isn't set up)
      try {
        const storedContact = localStorage.getItem("contactInfo");
        const storedSocials = localStorage.getItem("socials");
        const storedPortfolio = localStorage.getItem("portfolio");
        const storedFooterLinks = localStorage.getItem("footerLinks");
        const storedCalendly = localStorage.getItem("calendlyLink");

        if (storedContact) {
          console.log('📦 Loading contactInfo from localStorage');
          setContactInfo(JSON.parse(storedContact));
        }
        if (storedSocials) {
          console.log('📦 Loading socials from localStorage');
          setSocials(JSON.parse(storedSocials));
        }
        if (storedPortfolio) {
          console.log('📦 Loading portfolio from localStorage');
          setPortfolio(JSON.parse(storedPortfolio));
        }
        if (storedFooterLinks) {
          console.log('📦 Loading footerLinks from localStorage');
          setFooterLinks(JSON.parse(storedFooterLinks));
        }
        if (storedCalendly) {
          console.log('📦 Loading calendlyLink from localStorage');
          setCalendlyLink(storedCalendly);
        }
        console.log('✅ Data loaded from localStorage');
      } catch (error) {
        console.error("❌ Error loading from localStorage:", error);
      }
    };

    loadData();
  }, []);

  const updateContactInfo = async (info: ContactInfo): Promise<boolean> => {
    console.log('🔄 updateContactInfo called with:', info);
    console.log('🔍 Checking Supabase availability...');
    console.log('   URL:', import.meta.env.VITE_SUPABASE_URL || 'NOT SET');
    console.log('   Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
    
    setContactInfo(info);
    localStorage.setItem("contactInfo", JSON.stringify(info));
    
    // Save to Supabase for shared access
    const supabaseAvailable = isSupabaseAvailable();
    console.log('   Supabase available:', supabaseAvailable);
    
    if (supabaseAvailable) {
      try {
        console.log('✅ Supabase is available, proceeding to save contact info...');
        // Get current Supabase data first (this is the source of truth)
        const supabaseData = await getSiteData() || {};
        // Merge with current local state and new info
        const allData = {
          ...supabaseData, // Start with Supabase data (most up-to-date)
          contactInfo: info, // Override with new contact info
          // Keep other fields from Supabase if they exist, otherwise use local state
          socials: supabaseData.socials || socials,
          portfolio: supabaseData.portfolio || portfolio,
          footerLinks: supabaseData.footerLinks || footerLinks,
          calendlyLink: supabaseData.calendlyLink || calendlyLink,
        };
        console.log('📤 Calling saveSiteData with:', Object.keys(allData));
        const success = await saveSiteData(allData);
        console.log('📥 saveSiteData returned:', success);
        if (!success) {
          console.error("❌ Failed to save contact info to Supabase");
          alert("❌ Failed to save contact info to Supabase. Check console for details.");
          return false;
        } else {
          console.log("✅ Contact info saved to Supabase successfully!");
          return true;
        }
      } catch (error) {
        console.error("❌ Error saving contact info to Supabase:", error);
        return false;
      }
    } else {
      console.warn("⚠️ Supabase not available - contact info saved to localStorage only");
      return false;
    }
  };

  const updateSocials = async (newSocials: SocialLink[]): Promise<boolean> => {
    console.log('🔄 updateSocials called with:', newSocials);
    console.log('🔍 Checking Supabase availability...');
    console.log('   URL:', import.meta.env.VITE_SUPABASE_URL || 'NOT SET');
    console.log('   Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
    
    setSocials(newSocials);
    localStorage.setItem("socials", JSON.stringify(newSocials));
    
    // Save to Supabase for shared access
    const supabaseAvailable = isSupabaseAvailable();
    console.log('   Supabase available:', supabaseAvailable);
    
    if (supabaseAvailable) {
      console.log('✅ Supabase is available, proceeding to save socials...');
      try {
        // Get current Supabase data first (this is the source of truth)
        console.log('📡 Fetching current Supabase data...');
        const supabaseData = await getSiteData() || {};
        console.log('📦 Current Supabase data:', supabaseData);
        
        // Merge with current local state and new socials
        const allData = {
          ...supabaseData, // Start with Supabase data (most up-to-date)
          socials: newSocials, // Override with new socials
          // Keep other fields from Supabase if they exist, otherwise use local state
          contactInfo: supabaseData.contactInfo || contactInfo,
          portfolio: supabaseData.portfolio || portfolio,
          footerLinks: supabaseData.footerLinks || footerLinks,
          calendlyLink: supabaseData.calendlyLink || calendlyLink,
        };
        console.log('💾 Merged data to save:', allData);
        
        console.log('📤 Calling saveSiteData with:', Object.keys(allData));
        const success = await saveSiteData(allData);
        console.log('📥 saveSiteData returned:', success);
        if (!success) {
          console.error("❌ Failed to save socials to Supabase");
          alert("❌ Failed to save socials to Supabase. Check console for details.");
          return false;
        } else {
          console.log("✅ Socials saved to Supabase successfully!");
          return true;
        }
      } catch (error) {
        console.error("❌ Error saving socials to Supabase:", error);
        return false;
      }
    } else {
      console.warn("⚠️ Supabase not available - socials saved to localStorage only");
      return false;
    }
  };

  const addPortfolioItem = async (item: PortfolioItem): Promise<boolean> => {
    console.log('🔄 addPortfolioItem called with:', item);
    const newPortfolio = [...portfolio, item];
    setPortfolio(newPortfolio);
    localStorage.setItem("portfolio", JSON.stringify(newPortfolio));
    
    // Save to Supabase for shared access
    if (isSupabaseAvailable()) {
      try {
        console.log('✅ Supabase is available, proceeding to save portfolio...');
        // Get current Supabase data and merge with current state
        const supabaseData = await getSiteData() || {};
        const allData = {
          ...supabaseData,
          contactInfo: supabaseData.contactInfo || contactInfo,
          socials: supabaseData.socials || socials,
          portfolio: newPortfolio,
          footerLinks: supabaseData.footerLinks || footerLinks,
          calendlyLink: supabaseData.calendlyLink || calendlyLink,
        };
        const success = await saveSiteData(allData);
        if (!success) {
          console.error("❌ Failed to save portfolio to Supabase");
          return false;
        } else {
          console.log("✅ Portfolio saved to Supabase successfully!");
          return true;
        }
      } catch (error) {
        console.error("❌ Error saving portfolio to Supabase:", error);
        return false;
      }
    } else {
      console.warn("⚠️ Supabase not available - portfolio saved to localStorage only");
      return false;
    }
  };

  const removePortfolioItem = async (id: string): Promise<boolean> => {
    console.log('🔄 removePortfolioItem called with id:', id);
    const newPortfolio = portfolio.filter((item) => item.id !== id);
    setPortfolio(newPortfolio);
    localStorage.setItem("portfolio", JSON.stringify(newPortfolio));
    
    // Save to Supabase for shared access
    if (isSupabaseAvailable()) {
      try {
        console.log('✅ Supabase is available, proceeding to save portfolio...');
        // Get current Supabase data and merge with current state
        const supabaseData = await getSiteData() || {};
        const allData = {
          ...supabaseData,
          contactInfo: supabaseData.contactInfo || contactInfo,
          socials: supabaseData.socials || socials,
          portfolio: newPortfolio,
          footerLinks: supabaseData.footerLinks || footerLinks,
          calendlyLink: supabaseData.calendlyLink || calendlyLink,
        };
        const success = await saveSiteData(allData);
        if (!success) {
          console.error("❌ Failed to save portfolio to Supabase");
          return false;
        } else {
          console.log("✅ Portfolio saved to Supabase successfully!");
          return true;
        }
      } catch (error) {
        console.error("❌ Error saving portfolio to Supabase:", error);
        return false;
      }
    } else {
      console.warn("⚠️ Supabase not available - portfolio saved to localStorage only");
      return false;
    }
  };

  const updateFooterLinks = async (links: FooterLinks): Promise<boolean> => {
    console.log('🔄 updateFooterLinks called with:', links);
    setFooterLinks(links);
    localStorage.setItem("footerLinks", JSON.stringify(links));
    
    // Save to Supabase for shared access
    if (isSupabaseAvailable()) {
      try {
        console.log('✅ Supabase is available, proceeding to save footer links...');
        // Get current Supabase data first (this is the source of truth)
        const supabaseData = await getSiteData() || {};
        // Merge with current local state and new footer links
        const allData = {
          ...supabaseData, // Start with Supabase data (most up-to-date)
          footerLinks: links, // Override with new footer links
          // Keep other fields from Supabase if they exist, otherwise use local state
          contactInfo: supabaseData.contactInfo || contactInfo,
          socials: supabaseData.socials || socials,
          portfolio: supabaseData.portfolio || portfolio,
          calendlyLink: supabaseData.calendlyLink || calendlyLink,
        };
        const success = await saveSiteData(allData);
        if (!success) {
          console.error("❌ Failed to save footer links to Supabase");
          return false;
        } else {
          console.log("✅ Footer links saved to Supabase successfully!");
          return true;
        }
      } catch (error) {
        console.error("❌ Error saving footer links to Supabase:", error);
        return false;
      }
    } else {
      console.warn("⚠️ Supabase not available - footer links saved to localStorage only");
      return false;
    }
  };

  const updateCalendlyLink = async (link: string): Promise<boolean> => {
    console.log('🔄 updateCalendlyLink called with:', link);
    setCalendlyLink(link);
    localStorage.setItem("calendlyLink", link);
    
    // Save to Supabase for shared access
    if (isSupabaseAvailable()) {
      try {
        console.log('✅ Supabase is available, proceeding to save calendly link...');
        // Get current Supabase data first (this is the source of truth)
        const supabaseData = await getSiteData() || {};
        // Merge with current local state and new calendly link
        const allData = {
          ...supabaseData, // Start with Supabase data (most up-to-date)
          calendlyLink: link, // Override with new calendly link
          // Keep other fields from Supabase if they exist, otherwise use local state
          contactInfo: supabaseData.contactInfo || contactInfo,
          socials: supabaseData.socials || socials,
          portfolio: supabaseData.portfolio || portfolio,
          footerLinks: supabaseData.footerLinks || footerLinks,
        };
        const success = await saveSiteData(allData);
        if (!success) {
          console.error("❌ Failed to save calendly link to Supabase");
          return false;
        } else {
          console.log("✅ Calendly link saved to Supabase successfully!");
          return true;
        }
      } catch (error) {
        console.error("❌ Error saving calendly link to Supabase:", error);
        return false;
      }
    } else {
      console.warn("⚠️ Supabase not available - calendly link saved to localStorage only");
      return false;
    }
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

