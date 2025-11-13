import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Animals from "./pages/Animals";
import NotFound from "./pages/NotFound";
import UserManagement from "./pages/Users";
import Milking from "./pages/Milking";
import SettingsPage from "./pages/Settings";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Health from "./pages/Health";
import Breeding from "./pages/Breeding";
import Profile from "./pages/Profile";
import Preferences from "./pages/Preferences";
import FeedsPage from "./pages/Feeds";
import NotificationsPage from "./pages/Notification";
import SignIn from "./pages/SignIn";
import ProtectedRoute from "./components/ProtectedRoute";
import Support from "./pages/Support";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected dashboard routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/animals" element={<Animals />} />
            <Route path="/breeding" element={<Breeding />} />
            <Route path="/milking" element={<Milking />} />
            <Route path="/feeding" element={<FeedsPage />} />
            <Route path="/health" element={<Health />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/preferences" element={<Preferences />} />

            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/support" element={<Support />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
