import { useState } from "react";
import {
  Search,
  HelpCircle,
  Mail,
  MessageSquare,
  FileText,
  Video,
  Phone,
  Circle,
  Heart,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const Support = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });

  const helpCategories = [
    {
      icon: FileText,
      title: "Getting Started",
      description: "Learn the basics of using the dairy management system",
      articles: 12,
    },
    {
      icon: Circle,
      title: "Animal Management",
      description: "Managing your herd, tracking animals and records",
      articles: 18,
    },
    {
      icon: Heart,
      title: "Breeding & Health",
      description:
        "Breeding programs, health monitoring, and veterinary records",
      articles: 15,
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step video guides for common tasks",
      articles: 8,
    },
  ];

  const faqs = [
    {
      question: "How do I add a new animal to the system?",
      answer:
        "Navigate to the Animals page and click the 'Add Animal' button in the top right. Fill in the required information including tag number, breed, and birth date. You can also add optional information like parentage and health records.",
    },
    {
      question: "Can I track multiple farms in one account?",
      answer:
        "Yes! You can manage multiple farms under one account. Go to Farm Settings to add and switch between different farm locations. Each farm will have its own set of animals, records, and reports.",
    },
    {
      question: "How do I export my data and reports?",
      answer:
        "Visit the Reports page and select the type of report you want to generate. You can export data in CSV, PDF, or Excel format. Reports can include milk production, breeding records, health records, and more.",
    },
    {
      question: "What should I do if I notice an error in my data?",
      answer:
        "You can edit most records by clicking on them and selecting the edit option. For critical data issues or if you need to bulk update records, please contact support using the form below.",
    },
    {
      question: "How often is my data backed up?",
      answer:
        "Your data is automatically backed up every 24 hours to secure cloud storage. You can also manually export your data at any time for additional backup.",
    },
    {
      question: "Can I set up automated alerts and notifications?",
      answer:
        "Yes! Go to Preferences to configure notifications for breeding schedules, health checkups, milking schedules, and other important events. You can choose to receive alerts via email or in-app notifications.",
    },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      "Support request submitted! We'll get back to you within 24 hours."
    );
    setContactForm({
      name: "",
      email: "",
      subject: "",
      category: "",
      message: "",
    });
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Need Help?</h1>
        <p className="text-muted-foreground">
          Find answers to common questions or get in touch with our support team
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search for help articles, FAQs, or guides..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          {filteredFaqs.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No FAQs found matching your search.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {helpCategories.map((category) => (
          <Card
            key={category.title}
            className="hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardHeader>
              <category.icon className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg">{category.title}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {category.articles} articles
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="text-center">
            <Mail className="w-8 h-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">Email Support</CardTitle>
            <CardDescription>support@dhms.com</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <Phone className="w-8 h-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">Phone Support</CardTitle>
            <CardDescription>+254 726 509 023</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <MessageSquare className="w-8 h-8 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">Live Chat</CardTitle>
            <CardDescription>Available 9AM - 5PM EST</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>
            Can't find what you're looking for? Send us a message and we'll get
            back to you soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={contactForm.category}
                  onValueChange={(value) =>
                    setContactForm({ ...contactForm, category: value })
                  }
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="billing">Billing Question</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="data">Data Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your issue"
                  value={contactForm.subject}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, subject: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Please provide as much detail as possible..."
                className="min-h-[150px]"
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm({ ...contactForm, message: e.target.value })
                }
                required
              />
            </div>

            <Button type="submit" className="w-full md:w-auto">
              Submit Support Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
