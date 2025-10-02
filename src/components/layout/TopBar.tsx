import { useState } from "react";
import { Bell, ChevronDown, Heart, Droplets, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";

const recentAlerts = [
  {
    id: "1",
    type: "health",
    icon: Stethoscope,
    title: "Health Alert: Bessie",
    message: "Requires immediate attention",
    time: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "2",
    type: "breeding",
    icon: Heart,
    title: "Calving Due Soon",
    message: "Daisy expected in 5 days",
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "3",
    type: "milking",
    icon: Droplets,
    title: "Low Production",
    message: "Luna - 15% decrease",
    time: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
];

const getAlertColor = (type: string) => {
  switch (type) {
    case "health":
      return "text-red-600";
    case "breeding":
      return "text-pink-600";
    case "milking":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
};

export function TopBar() {
  const navigate = useNavigate();
  const [alertsOpen, setAlertsOpen] = useState(false);

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
        </div>

        <div className="flex items-center gap-3">
          {/* Alerts Dropdown */}
          <DropdownMenu open={alertsOpen} onOpenChange={setAlertsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {recentAlerts.length}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Recent Alerts</span>
                <Badge variant="secondary">{recentAlerts.length} new</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[300px]">
                <div className="space-y-1 p-2">
                  {recentAlerts.map((alert) => {
                    const Icon = alert.icon;
                    return (
                      <div
                        key={alert.id}
                        className="p-3 rounded-md hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => {
                          setAlertsOpen(false);
                          navigate("/notifications");
                        }}
                      >
                        <div className="flex gap-3">
                          <div
                            className={`p-2 rounded-full bg-muted ${getAlertColor(
                              alert.type
                            )} shrink-0`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium mb-1">
                              {alert.title}
                            </p>
                            <p className="text-xs text-muted-foreground mb-1">
                              {alert.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(alert.time, {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="w-full text-center justify-center cursor-pointer"
                onClick={() => {
                  setAlertsOpen(false);
                  navigate("/notifications");
                }}
              >
                View All Notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/avatars/farm-manager.png" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    FM
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">Farm Manager</div>
                  <div className="text-xs text-muted-foreground">
                    Green Valley Farm
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/farm-settings")}>
                Farm Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/preferences")}>
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
