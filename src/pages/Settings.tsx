import {
  Settings as SettingsIcon,
  Bell,
  Database,
  Smartphone,
  Mail,
  Lock,
  User,
  Building2,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          System Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure farm settings and system preferences
        </p>
      </div>

      <Tabs defaultValue="farm" className="space-y-6">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger
            value="farm"
            className="text-sm sm:text-base px-2 sm:px-4 py-1 sm:py-2"
          >
            Farm Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="text-sm sm:text-base px-2 sm:px-4 py-1 sm:py-2"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="data"
            className="text-sm sm:text-base px-2 sm:px-4 py-1 sm:py-2"
          >
            Data & Backup
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="text-sm sm:text-base px-2 sm:px-4 py-1 sm:py-2"
          >
            Security
          </TabsTrigger>
        </TabsList>

        {/* Farm Profile Tab */}
        <TabsContent value="farm" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Farm Information
              </CardTitle>
              <CardDescription>
                Update your farm's basic information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="farm-name">Farm Name</Label>
                  <Input
                    id="farm-name"
                    defaultValue="Green Valley Dairy Farm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner-name">Owner Name</Label>
                  <Input id="owner-name" defaultValue="Hezron Bett" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="contact@greenvalley.farm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="0726509023" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Farm Address</Label>
                  <Input
                    id="address"
                    defaultValue="1234 Rural Road, Farmville, ST 12345"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="herd-size">Total Herd Size</Label>
                  <Input id="herd-size" type="number" defaultValue="450" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farm-area">Farm Area (acres)</Label>
                  <Input id="farm-area" type="number" defaultValue="850" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Manage how and when you receive alerts about your farm
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Calving Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when calving is imminent or
                      completed
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Health Event Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Alerts for treatments, vaccinations, and health issues
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Milk Production Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when milk production falls below threshold
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts via email
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive urgent alerts via text message
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mobile Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get instant alerts on your mobile device
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data & Backup Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Data Management
              </CardTitle>
              <CardDescription>
                Manage your farm data, backups, and sync settings
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically backup data daily at 2:00 AM
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cloud Sync</Label>
                    <p className="text-sm text-muted-foreground">
                      Sync data across all devices in real-time
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Backup Actions</h4>
                <div className="flex gap-2 sm:gap-3 flex-wrap">
                  <Button
                    variant="outline"
                    className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 gap-1 sm:gap-2"
                  >
                    <Database className="w-3 h-3 sm:w-4 sm:h-4" />
                    Create Backup
                  </Button>
                  <Button
                    variant="outline"
                    className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 gap-1 sm:gap-2"
                  >
                    <Database className="w-3 h-3 sm:w-4 sm:h-4" />
                    Restore Backup
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Last backup: Today at 2:00 AM • Next backup: Tomorrow at 2:00
                  AM
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>
                Download your farm data in various formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                >
                  Export to PDF
                </Button>
                <Button
                  variant="outline"
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                >
                  Export to Excel
                </Button>
                <Button
                  variant="outline"
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                >
                  Export to CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Change Password</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out after 30 minutes of inactivity
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
