import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOrders } from "@/contexts/OrdersContext";

const OrderForm = () => {
  const { toast } = useToast();
  const { addOrder } = useOrders();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert file to base64 if present
      let productImage: string | null = null;
      let productImageName: string | null = null;

      if (selectedFile) {
        productImageName = selectedFile.name;
        productImage = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });
      }

      // Add order to context
      addOrder({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        description: formData.description,
        productImage,
        productImageName,
      });

      toast({
        title: "Order Received!",
        description: "We'll contact you shortly to discuss your project.",
      });

      // Reset form
      setFormData({ name: "", email: "", phone: "", description: "" });
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById("file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="order" className="py-24 bg-gradient-radial">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Send size={16} className="text-accent" />
            <span className="text-sm text-muted-foreground">Get Started</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Start Your <span className="bg-gradient-flow bg-clip-text text-transparent">Project</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your product photo and tell us your vision
          </p>
        </div>

        <Card className="max-w-2xl mx-auto bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Fill in the information below to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone"
                  type="tel"
                  placeholder="+216 XX XXX XXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Product Photo</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <label htmlFor="file" className="cursor-pointer">
                    <Upload size={32} className="mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {selectedFile ? selectedFile.name : "Click to upload product image"}
                    </p>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea 
                  id="description"
                  placeholder="Tell us about your product and vision..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : (
                  <>
                    Submit Order <Send className="ml-2" size={20} />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OrderForm;
