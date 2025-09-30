import { useState } from "react";
import {
  Activity,
  Plus,
  Search,
  Syringe,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HealthRecord {
  id: string;
  animalTag: string;
  animalName: string;
  type: "vaccination" | "treatment" | "checkup" | "emergency";
  description: string;
  date: string;
  veterinarian: string;
  status: "completed" | "scheduled" | "overdue";
  notes?: string;
}

const mockHealthRecords: HealthRecord[] = [
  {
    id: "H001",
    animalTag: "A-2401",
    animalName: "Bessie",
    type: "vaccination",
    description: "Annual BVD Vaccination",
    date: "2024-03-15",
    veterinarian: "Dr. Sarah Johnson",
    status: "completed",
    notes: "No adverse reactions observed",
  },
  {
    id: "H002",
    animalTag: "A-2405",
    animalName: "Daisy",
    type: "treatment",
    description: "Mastitis Treatment",
    date: "2024-03-18",
    veterinarian: "Dr. Michael Chen",
    status: "completed",
    notes: "Antibiotics prescribed for 7 days",
  },
  {
    id: "H003",
    animalTag: "A-2410",
    animalName: "Luna",
    type: "checkup",
    description: "Pregnancy Check",
    date: "2024-03-20",
    veterinarian: "Dr. Sarah Johnson",
    status: "completed",
    notes: "Confirmed pregnant - 60 days",
  },
  {
    id: "H004",
    animalTag: "A-2415",
    animalName: "Rosie",
    type: "vaccination",
    description: "Clostridial Vaccine",
    date: "2024-03-25",
    veterinarian: "Dr. Sarah Johnson",
    status: "scheduled",
  },
  {
    id: "H005",
    animalTag: "A-2420",
    animalName: "Bella",
    type: "treatment",
    description: "Hoof Trimming",
    date: "2024-03-22",
    veterinarian: "John Smith (Hoof Trimmer)",
    status: "completed",
  },
  {
    id: "H006",
    animalTag: "A-2408",
    animalName: "Molly",
    type: "vaccination",
    description: "IBR Vaccination",
    date: "2024-03-10",
    veterinarian: "Dr. Sarah Johnson",
    status: "overdue",
  },
];

const upcomingEvents = [
  {
    id: "U001",
    animalTag: "A-2415",
    animalName: "Rosie",
    type: "vaccination",
    description: "Clostridial Vaccine",
    dueDate: "2024-03-25",
    daysUntil: 5,
  },
  {
    id: "U002",
    animalTag: "A-2425",
    animalName: "Clover",
    type: "checkup",
    description: "Pregnancy Verification",
    dueDate: "2024-03-28",
    daysUntil: 8,
  },
  {
    id: "U003",
    animalTag: "A-2430",
    animalName: "Matilda",
    type: "vaccination",
    description: "Annual Vaccine Booster",
    dueDate: "2024-04-02",
    daysUntil: 13,
  },
];

function getTypeIcon(type: string) {
  switch (type) {
    case "vaccination":
      return <Syringe className="w-4 h-4" />;
    case "treatment":
      return <Stethoscope className="w-4 h-4" />;
    case "checkup":
      return <Activity className="w-4 h-4" />;
    case "emergency":
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <Activity className="w-4 h-4" />;
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case "vaccination":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "treatment":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
    case "checkup":
      return "bg-green-500/10 text-green-600 dark:text-green-400";
    case "emergency":
      return "bg-red-500/10 text-red-600 dark:text-red-400";
    default:
      return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-500/10 text-green-600 dark:text-green-400";
    case "scheduled":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "overdue":
      return "bg-red-500/10 text-red-600 dark:text-red-400";
    default:
      return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
  }
}

export default function Health() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredRecords = mockHealthRecords.filter((record) => {
    const matchesSearch =
      record.animalTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || record.type === selectedType;
    return matchesSearch && matchesType;
  });

  const stats = [
    {
      title: "Total Health Events",
      value: "152",
      change: "+12 this month",
      icon: Activity,
    },
    {
      title: "Scheduled Events",
      value: "8",
      change: "Next 30 days",
      icon: Calendar,
    },
    {
      title: "Overdue Vaccinations",
      value: "3",
      change: "Requires attention",
      icon: AlertTriangle,
    },
    {
      title: "Active Treatments",
      value: "5",
      change: "In progress",
      icon: Stethoscope,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Activity className="w-8 h-8 text-primary" />
            Health Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Track veterinary treatments, vaccinations, and health events
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Health Record
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="records" className="space-y-6">
        <TabsList>
          <TabsTrigger value="records">Health Records</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
        </TabsList>

        {/* Health Records Tab */}
        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle>Health Records</CardTitle>
              <CardDescription>
                Complete history of all health-related activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by tag, name, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="vaccination">Vaccinations</option>
                  <option value="treatment">Treatments</option>
                  <option value="checkup">Check-ups</option>
                  <option value="emergency">Emergencies</option>
                </select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Animal</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Veterinarian</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{record.animalTag}</p>
                            <p className="text-sm text-muted-foreground">
                              {record.animalName}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`gap-1 ${getTypeColor(record.type)}`}
                          >
                            {getTypeIcon(record.type)}
                            {record.type.charAt(0).toUpperCase() +
                              record.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{record.description}</p>
                            {record.notes && (
                              <p className="text-sm text-muted-foreground">
                                {record.notes}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{record.date}</TableCell>
                        <TableCell className="text-sm">
                          {record.veterinarian}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusColor(record.status)}
                          >
                            {record.status === "completed" && (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            )}
                            {record.status === "scheduled" && (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {record.status === "overdue" && (
                              <AlertTriangle className="w-3 h-3 mr-1" />
                            )}
                            {record.status.charAt(0).toUpperCase() +
                              record.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredRecords.length === 0 && (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No health records found matching your search criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upcoming Events Tab */}
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Health Events</CardTitle>
              <CardDescription>
                Scheduled vaccinations, treatments, and check-ups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-full ${getTypeColor(
                          event.type
                        )}`}
                      >
                        {getTypeIcon(event.type)}
                      </div>
                      <div>
                        <p className="font-medium">{event.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.animalTag} - {event.animalName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{event.dueDate}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.daysUntil} days until due
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
