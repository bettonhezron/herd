import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Animals from "./pages/Animals";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import { Heart, Droplets, Activity, BarChart3, Calendar, Users, Settings } from "lucide-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/animals" element={<Animals />} />
            <Route path="/breeding" element={
              <PlaceholderPage 
                title="Breeding Management"
                description="Track breeding cycles, artificial insemination, and calving records"
                icon={<Heart className="w-8 h-8 text-primary" />}
                features={[
                  "Breeding cycle tracking and heat detection",
                  "Artificial insemination scheduling and records",
                  "Pregnancy monitoring and ultrasound tracking",
                  "Calving calendar and birth notifications",
                  "Genetic lineage and breeding value calculations"
                ]}
              />
            } />
            <Route path="/milking" element={
              <PlaceholderPage 
                title="Milking Management"
                description="Monitor milk production, quality, and milking schedules"
                icon={<Droplets className="w-8 h-8 text-primary" />}
                features={[
                  "Daily milk production tracking per animal",
                  "Milk quality testing and SCC monitoring",
                  "Automated milking system integration",
                  "Production analytics and trend analysis",
                  "Milk storage and collection scheduling"
                ]}
              />
            } />
            <Route path="/health" element={
              <PlaceholderPage 
                title="Health Management"
                description="Track veterinary treatments, vaccinations, and health events"
                icon={<Activity className="w-8 h-8 text-primary" />}
                features={[
                  "Vaccination scheduling and reminders",
                  "Health event logging and treatment records",
                  "Veterinary visit planning and history",
                  "Disease outbreak monitoring and alerts",
                  "Body condition scoring and weight tracking"
                ]}
              />
            } />
            <Route path="/analytics" element={
              <PlaceholderPage 
                title="Analytics Dashboard"
                description="Advanced analytics and performance insights"
                icon={<BarChart3 className="w-8 h-8 text-primary" />}
                features={[
                  "Production efficiency analytics",
                  "Feed conversion ratio calculations",
                  "Financial performance tracking",
                  "Herd performance benchmarking",
                  "Predictive analytics for decision making"
                ]}
              />
            } />
            <Route path="/reports" element={
              <PlaceholderPage 
                title="Reports & Documentation"
                description="Generate compliance reports and documentation"
                icon={<Calendar className="w-8 h-8 text-primary" />}
                features={[
                  "Regulatory compliance reporting",
                  "Custom report builder with templates",
                  "Export data to PDF, Excel, and CSV",
                  "Automated report scheduling and delivery",
                  "Historical data analysis and trends"
                ]}
              />
            } />
            <Route path="/users" element={
              <PlaceholderPage 
                title="User Management"
                description="Manage farm staff and access permissions"
                icon={<Users className="w-8 h-8 text-primary" />}
                features={[
                  "Role-based access control system",
                  "Staff scheduling and task assignment",
                  "User activity logging and audit trails",
                  "Multi-farm management support",
                  "Mobile app access management"
                ]}
              />
            } />
            <Route path="/settings" element={
              <PlaceholderPage 
                title="System Settings"
                description="Configure farm settings and system preferences"
                icon={<Settings className="w-8 h-8 text-primary" />}
                features={[
                  "Farm profile and configuration",
                  "Alert and notification preferences",
                  "Data backup and sync settings",
                  "Integration with farm equipment",
                  "System maintenance and updates"
                ]}
              />
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
