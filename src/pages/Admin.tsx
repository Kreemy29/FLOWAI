import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useOrders, Order } from "@/contexts/OrdersContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/services/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Trash2, Upload, Plus, Eye, Home, Mail, Phone, Calendar } from "lucide-react";
import Navigation from "@/components/Navigation";
import { format } from "date-fns";

const Admin = () => {
  const { user, logout, isAdmin } = useAuth();
  const {
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
  } = useData();
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [contactForm, setContactForm] = useState(contactInfo);
  const [socialsForm, setSocialsForm] = useState(socials);
  const [footerForm, setFooterForm] = useState(footerLinks);
  const [calendlyForm, setCalendlyForm] = useState(calendlyLink);
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    type: "image" as "image" | "video",
    alt: "",
    file: null as File | null,
  });
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);

  useEffect(() => {
    // Wait a moment for auth to initialize from localStorage
    const checkAuth = async () => {
      // Give auth context time to load from localStorage
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if user is in localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user.role === "admin") {
            setIsCheckingAuth(false);
            return;
          }
        } catch (e) {
          console.error("Error parsing user from localStorage:", e);
        }
      }
      
      // If not admin, redirect to login
      if (!isAdmin) {
        navigate("/login");
      } else {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [isAdmin, navigate]);

  // Load registered users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await getAllUsers();
        setRegisteredUsers(users);
        console.log('📊 Loaded users from Supabase:', users);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };
    
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const handleContactSave = async () => {
    try {
      console.log('🔘 Save Contact Info button clicked');
      const success = await updateContactInfo(contactForm);
      
      if (success) {
        toast({
          title: "✅ Contact info saved",
          description: "Changes have been saved to Supabase and are now visible to all users",
        });
      } else {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const supabaseAvailable = !!(url && key && url !== '' && key !== '');
        
        if (supabaseAvailable) {
          toast({
            title: "❌ Save failed",
            description: "Failed to save to Supabase. Check console for details.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "⚠️ Contact info saved (local only)",
            description: "Changes saved locally. Supabase not configured.",
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error("Error saving contact info:", error);
      toast({
        title: "❌ Save failed",
        description: "Failed to save contact info. Check console for details.",
        variant: "destructive",
      });
    }
  };

  const handleSocialsSave = async () => {
    try {
      console.log('🔘 Save Social Links button clicked');
      console.log('📝 Form data:', socialsForm);
      
      const success = await updateSocials(socialsForm);
      
      if (success) {
        toast({
          title: "✅ Social links saved",
          description: "Changes have been saved to Supabase and are now visible to all users",
        });
      } else {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const supabaseAvailable = !!(url && key && url !== '' && key !== '');
        
        if (supabaseAvailable) {
          toast({
            title: "❌ Save failed",
            description: "Failed to save to Supabase. Check console for details.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "⚠️ Social links saved (local only)",
            description: "Changes saved locally. Supabase not configured.",
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error("Error saving socials:", error);
      toast({
        title: "❌ Save failed",
        description: "Failed to save social links. Check console for details.",
        variant: "destructive",
      });
    }
  };

  const handleFooterSave = async () => {
    try {
      console.log('🔘 Save Footer Links button clicked');
      const success = await updateFooterLinks(footerForm);
      
      if (success) {
        toast({
          title: "✅ Footer links saved",
          description: "Changes have been saved to Supabase and are now visible to all users",
        });
      } else {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const supabaseAvailable = !!(url && key && url !== '' && key !== '');
        
        if (supabaseAvailable) {
          toast({
            title: "❌ Save failed",
            description: "Failed to save to Supabase. Check console for details.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "⚠️ Footer links saved (local only)",
            description: "Changes saved locally. Supabase not configured.",
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error("Error saving footer links:", error);
      toast({
        title: "❌ Save failed",
        description: "Failed to save footer links. Check console for details.",
        variant: "destructive",
      });
    }
  };

  const handleCalendlySave = async () => {
    try {
      console.log('🔘 Save Calendly Link button clicked');
      const success = await updateCalendlyLink(calendlyForm);
      
      if (success) {
        toast({
          title: "✅ Calendly link saved",
          description: "Changes have been saved to Supabase and are now visible to all users",
        });
      } else {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const supabaseAvailable = !!(url && key && url !== '' && key !== '');
        
        if (supabaseAvailable) {
          toast({
            title: "❌ Save failed",
            description: "Failed to save to Supabase. Check console for details.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "⚠️ Calendly link saved (local only)",
            description: "Changes saved locally. Supabase not configured.",
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error("Error saving calendly link:", error);
      toast({
        title: "❌ Save failed",
        description: "Failed to save Calendly link. Check console for details.",
        variant: "destructive",
      });
    }
  };

  const handleAddPortfolioItem = async () => {
    if (!newPortfolioItem.file && !newPortfolioItem.alt) {
      toast({
        title: "Error",
        description: "Please provide an image/video and alt text",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const item = {
        id: Date.now().toString(),
        type: newPortfolioItem.type,
        src: reader.result as string,
        alt: newPortfolioItem.alt,
      };
      console.log('🔘 Add Portfolio Item button clicked');
      const success = await addPortfolioItem(item);
      
      if (success) {
        toast({
          title: "✅ Portfolio item added",
          description: "New item has been added and saved to Supabase",
        });
      } else {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const supabaseAvailable = !!(url && key && url !== '' && key !== '');
        
        if (supabaseAvailable) {
          toast({
            title: "❌ Save failed",
            description: "Failed to save to Supabase. Check console for details.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "⚠️ Portfolio item added (local only)",
            description: "Item added locally. Supabase not configured.",
            variant: "default",
          });
        }
      }
      setNewPortfolioItem({ type: "image", alt: "", file: null });
    };
    reader.readAsDataURL(newPortfolioItem.file!);
  };

  const handleRemovePortfolioItem = async (id: string) => {
    console.log('🔘 Remove Portfolio Item button clicked');
    const success = await removePortfolioItem(id);
    
    if (success) {
      toast({
        title: "✅ Portfolio item removed",
        description: "Item has been removed and saved to Supabase",
      });
    } else {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const supabaseAvailable = !!(url && key && url !== '' && key !== '');
      
      if (supabaseAvailable) {
        toast({
          title: "❌ Save failed",
          description: "Failed to save to Supabase. Check console for details.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "⚠️ Portfolio item removed (local only)",
          description: "Item removed locally. Supabase not configured.",
          variant: "default",
        });
      }
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome, {user?.email}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/")}>
                <Home className="mr-2" size={20} />
                View Website
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2" size={20} />
                Logout
              </Button>
            </div>
          </div>

          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
              <TabsTrigger value="users">Users ({registeredUsers.length})</TabsTrigger>
              <TabsTrigger value="contact">Contact Info</TabsTrigger>
              <TabsTrigger value="socials">Social Links</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="footer">Footer & Links</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Submitted Orders</CardTitle>
                  <CardDescription>
                    View and manage all orders submitted through the website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="mx-auto mb-4" size={48} />
                      <p>No orders submitted yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card key={order.id} className="border-border">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="text-lg font-semibold">{order.name}</h3>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Mail size={14} />
                                        <a href={`mailto:${order.email}`} className="hover:text-primary">
                                          {order.email}
                                        </a>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Phone size={14} />
                                        <a href={`tel:${order.phone}`} className="hover:text-primary">
                                          {order.phone}
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Select
                                      value={order.status}
                                      onValueChange={(value: Order["status"]) => {
                                        updateOrderStatus(order.id, value);
                                        toast({
                                          title: "Order status updated",
                                          description: `Order status changed to ${value}`,
                                        });
                                      }}
                                    >
                                      <SelectTrigger className="w-32">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => {
                                        if (confirm("Are you sure you want to delete this order?")) {
                                          deleteOrder(order.id);
                                          toast({
                                            title: "Order deleted",
                                            description: "Order has been removed",
                                          });
                                        }
                                      }}
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                </div>

                                <div>
                                  <p className="text-sm font-medium mb-1">Description:</p>
                                  <p className="text-sm text-muted-foreground">{order.description}</p>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar size={12} />
                                  <span>
                                    Submitted: {format(new Date(order.createdAt), "PPp")}
                                  </span>
                                </div>
                              </div>

                              {order.productImage && (
                                <div className="md:w-48">
                                  <p className="text-sm font-medium mb-2">Product Image:</p>
                                  <div className="relative aspect-square rounded-lg overflow-hidden border border-border">
                                    <img
                                      src={order.productImage}
                                      alt={order.productImageName || "Product image"}
                                      className="w-full h-full object-cover"
                                    />
                                    <a
                                      href={order.productImage}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 hover:opacity-100 transition-opacity"
                                    >
                                      <Eye size={24} />
                                    </a>
                                  </div>
                                  {order.productImageName && (
                                    <p className="text-xs text-muted-foreground mt-1 truncate">
                                      {order.productImageName}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Users</CardTitle>
                  <CardDescription>
                    View all user accounts registered on the website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {registeredUsers.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Mail className="mx-auto mb-4" size={48} />
                      <p>No users registered yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {registeredUsers.map((user) => (
                        <Card key={user.id} className="border-border">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{user.email}</h3>
                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                  <span className="capitalize">{user.role}</span>
                                  <span>•</span>
                                  <span>
                                    Joined: {format(new Date(user.created_at), "PPp")}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {user.role === 'admin' && (
                                  <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                                    Admin
                                  </span>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Update phone number, email, and contact links
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={contactForm.phone}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneAction">Phone Action (tel: link)</Label>
                    <Input
                      id="phoneAction"
                      value={contactForm.phoneAction}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          phoneAction: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailAction">Email Action (mailto: link)</Label>
                    <Input
                      id="emailAction"
                      value={contactForm.emailAction}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          emailAction: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="calendly">Calendly Link</Label>
                    <Input
                      id="calendly"
                      value={calendlyForm}
                      onChange={(e) => setCalendlyForm(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleContactSave} variant="hero">
                    Save Contact Info
                  </Button>
                  <Button
                    onClick={handleCalendlySave}
                    variant="outline"
                    className="ml-2"
                  >
                    Save Calendly Link
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="socials">
              <Card>
                <CardHeader>
                  <CardTitle>Social Media Links</CardTitle>
                  <CardDescription>
                    Update your social media profile links
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {socialsForm.map((social, index) => (
                    <div key={index} className="space-y-2">
                      <Label>{social.name}</Label>
                      <Input
                        value={social.url}
                        onChange={(e) => {
                          const newSocials = [...socialsForm];
                          newSocials[index].url = e.target.value;
                          setSocialsForm(newSocials);
                        }}
                      />
                    </div>
                  ))}
                  <Button onClick={handleSocialsSave} variant="hero">
                    Save Social Links
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Management</CardTitle>
                  <CardDescription>
                    Add or remove images and videos from your portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Add New Item</h3>
                    <div className="space-y-2">
                      <Label htmlFor="portfolioType">Type</Label>
                      <select
                        id="portfolioType"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        value={newPortfolioItem.type}
                        onChange={(e) =>
                          setNewPortfolioItem({
                            ...newPortfolioItem,
                            type: e.target.value as "image" | "video",
                          })
                        }
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="portfolioAlt">Alt Text / Description</Label>
                      <Input
                        id="portfolioAlt"
                        value={newPortfolioItem.alt}
                        onChange={(e) =>
                          setNewPortfolioItem({
                            ...newPortfolioItem,
                            alt: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="portfolioFile">File</Label>
                      <Input
                        id="portfolioFile"
                        type="file"
                        accept={newPortfolioItem.type === "image" ? "image/*" : "video/*"}
                        onChange={(e) =>
                          setNewPortfolioItem({
                            ...newPortfolioItem,
                            file: e.target.files?.[0] || null,
                          })
                        }
                      />
                    </div>
                    <Button onClick={handleAddPortfolioItem} variant="hero">
                      <Plus className="mr-2" size={20} />
                      Add to Portfolio
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Current Portfolio Items</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {portfolio.map((item) => (
                        <Card key={item.id} className="relative">
                          <CardContent className="p-4">
                            <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-secondary">
                              {item.type === "image" ? (
                                <img
                                  src={item.src}
                                  alt={item.alt}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <video
                                  src={item.src}
                                  className="w-full h-full object-cover"
                                  controls
                                />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {item.alt}
                            </p>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemovePortfolioItem(item.id)}
                            >
                              <Trash2 className="mr-2" size={16} />
                              Remove
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="footer">
              <Card>
                <CardHeader>
                  <CardTitle>Footer Links</CardTitle>
                  <CardDescription>
                    Update footer navigation links
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="privacyPolicy">Privacy Policy Link</Label>
                    <Input
                      id="privacyPolicy"
                      value={footerForm.privacyPolicy}
                      onChange={(e) =>
                        setFooterForm({
                          ...footerForm,
                          privacyPolicy: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="termsOfService">Terms of Service Link</Label>
                    <Input
                      id="termsOfService"
                      value={footerForm.termsOfService}
                      onChange={(e) =>
                        setFooterForm({
                          ...footerForm,
                          termsOfService: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button onClick={handleFooterSave} variant="hero">
                    Save Footer Links
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;

