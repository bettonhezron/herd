import { useState } from "react";
import {
  Search,
  Archive,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Heart,
  Droplets,
  Stethoscope,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: "health" | "breeding" | "milking" | "alert";
  priority: "high" | "medium" | "low";
  title: string;
  message: string;
  time: Date;
  read: boolean;
  archived: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "health",
    priority: "high",
    title: "Health Alert: Bessie",
    message:
      "Animal A-2401 (Bessie) requires immediate veterinary attention. High fever detected.",
    time: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    archived: false,
  },
  {
    id: "2",
    type: "breeding",
    priority: "medium",
    title: "Calving Due Soon",
    message:
      "Daisy (A-2405) is expected to calve in 5 days. Prepare calving pen.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
    archived: false,
  },
  {
    id: "3",
    type: "milking",
    priority: "low",
    title: "Low Milk Production",
    message: "Luna (A-2410) showed 15% decrease in milk production today.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 4),
    read: true,
    archived: false,
  },
  {
    id: "4",
    type: "alert",
    priority: "high",
    title: "System Alert",
    message: "Monthly health checkups due for 8 animals next week.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 6),
    read: true,
    archived: false,
  },
  {
    id: "5",
    type: "health",
    priority: "medium",
    title: "Vaccination Reminder",
    message: "5 animals due for vaccination this week.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    archived: false,
  },
  {
    id: "6",
    type: "breeding",
    priority: "low",
    title: "Heat Detection",
    message: "Rose (A-2415) is showing signs of heat. Consider breeding.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    read: true,
    archived: true,
  },
];

const getIconByType = (type: string) => {
  switch (type) {
    case "health":
      return Stethoscope;
    case "breeding":
      return Heart;
    case "milking":
      return Droplets;
    case "alert":
      return AlertTriangle;
    default:
      return Bell;
  }
};

const getIconColor = (type: string) => {
  switch (type) {
    case "health":
      return "text-red-600";
    case "breeding":
      return "text-pink-600";
    case "milking":
      return "text-blue-600";
    case "alert":
      return "text-yellow-600";
    default:
      return "text-gray-600";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-500/10 text-red-600 border-red-200";
    case "medium":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
    case "low":
      return "bg-blue-500/10 text-blue-600 border-blue-200";
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-200";
  }
};

export default function Notifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    string | null
  >(null);

  const filteredNotifications = notifications.filter((notification) => {
    if (notification.archived) return false;

    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || notification.type === selectedType;
    const matchesPriority =
      selectedPriority === "all" || notification.priority === selectedPriority;
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "read" && notification.read) ||
      (selectedStatus === "unread" && !notification.read);

    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });

  const archivedNotifications = notifications.filter((n) => n.archived);
  const unreadCount = notifications.filter(
    (n) => !n.read && !n.archived
  ).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    toast.success("Notification marked as read");
  };

  const handleMarkAsUnread = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: false } : n))
    );
    toast.success("Notification marked as unread");
  };

  const handleArchive = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, archived: true } : n))
    );
    toast.success("Notification archived");
  };

  const handleUnarchive = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, archived: false } : n))
    );
    toast.success("Notification unarchived");
  };

  const handleDelete = () => {
    if (selectedNotificationId) {
      setNotifications(
        notifications.filter((n) => n.id !== selectedNotificationId)
      );
      toast.success("Notification deleted");
      setSelectedNotificationId(null);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const renderNotification = (
    notification: Notification,
    isArchived = false
  ) => {
    const Icon = getIconByType(notification.type);

    return (
      <Card
        key={notification.id}
        className={notification.read ? "opacity-60" : ""}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div
              className={`p-2 rounded-full bg-muted ${getIconColor(
                notification.type
              )}`}
            >
              <Icon className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-sm">
                    {notification.title}
                  </h3>
                  <Badge
                    variant="secondary"
                    className={getPriorityColor(notification.priority)}
                  >
                    {notification.priority}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(notification.time, { addSuffix: true })}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                {notification.message}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="h-8"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Mark as read
                  </Button>
                )}
                {notification.read && !isArchived && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsUnread(notification.id)}
                    className="h-8"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Mark as unread
                  </Button>
                )}
                {!isArchived && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleArchive(notification.id)}
                    className="h-8"
                  >
                    <Archive className="w-3 h-3 mr-1" />
                    Archive
                  </Button>
                )}
                {isArchived && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnarchive(notification.id)}
                    className="h-8"
                  >
                    <Archive className="w-3 h-3 mr-1" />
                    Unarchive
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedNotificationId(notification.id);
                    setDeleteModalOpen(true);
                  }}
                  className="h-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left section */}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full">
                {unreadCount}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-2">
            Manage all your farm notifications and alerts
          </p>
        </div>

        {/* Right section */}
        <Button
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0}
          className="gap-2 px-3 py-2 self-start sm:self-auto text-sm sm:text-base"
        >
          <Check className="w-4 h-4" />
          Mark All as Read
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Notifications</TabsTrigger>
          <TabsTrigger value="archived">
            Archived ({archivedNotifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>
                Filter notifications by type, priority, and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="breeding">Breeding</SelectItem>
                    <SelectItem value="milking">Milking</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedPriority}
                  onValueChange={setSelectedPriority}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">
                    No notifications found
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) =>
                renderNotification(notification)
              )
            )}
          </div>
        </TabsContent>

        <TabsContent value="archived" className="space-y-3">
          {archivedNotifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Archive className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No archived notifications
                </p>
              </CardContent>
            </Card>
          ) : (
            archivedNotifications.map((notification) =>
              renderNotification(notification, true)
            )
          )}
        </TabsContent>
      </Tabs>

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Notification"
        description="Are you sure you want to delete this notification? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
