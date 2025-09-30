import { useState } from "react";
import {
  Heart,
  Plus,
  Search,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Baby,
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
import { Progress } from "@/components/ui/progress";

interface BreedingRecord {
  id: string;
  animalTag: string;
  animalName: string;
  breedingDate: string;
  method: "AI" | "Natural";
  bullId?: string;
  status: "pending" | "confirmed" | "failed";
  expectedCalvingDate?: string;
  actualCalvingDate?: string;
  notes?: string;
}

interface PregnancyRecord {
  id: string;
  animalTag: string;
  animalName: string;
  breedingDate: string;
  confirmationDate: string;
  expectedCalvingDate: string;
  daysPregnant: number;
  trimester: 1 | 2 | 3;
  lastCheckup: string;
  status: "healthy" | "attention" | "critical";
}

const mockBreedingRecords: BreedingRecord[] = [
  {
    id: "B001",
    animalTag: "A-2401",
    animalName: "Bessie",
    breedingDate: "2024-01-15",
    method: "AI",
    bullId: "BULL-789",
    status: "confirmed",
    expectedCalvingDate: "2024-10-22",
    notes: "First insemination successful",
  },
  {
    id: "B002",
    animalTag: "A-2405",
    animalName: "Daisy",
    breedingDate: "2024-02-10",
    method: "AI",
    bullId: "BULL-456",
    status: "confirmed",
    expectedCalvingDate: "2024-11-18",
  },
  {
    id: "B003",
    animalTag: "A-2410",
    animalName: "Luna",
    breedingDate: "2024-03-05",
    method: "Natural",
    status: "pending",
    notes: "Awaiting pregnancy confirmation",
  },
  {
    id: "B004",
    animalTag: "A-2415",
    animalName: "Rosie",
    breedingDate: "2024-02-20",
    method: "AI",
    bullId: "BULL-789",
    status: "failed",
    notes: "Did not conceive, scheduled for re-breeding",
  },
];

const mockPregnancyRecords: PregnancyRecord[] = [
  {
    id: "P001",
    animalTag: "A-2401",
    animalName: "Bessie",
    breedingDate: "2024-01-15",
    confirmationDate: "2024-02-15",
    expectedCalvingDate: "2024-10-22",
    daysPregnant: 65,
    trimester: 1,
    lastCheckup: "2024-03-10",
    status: "healthy",
  },
  {
    id: "P002",
    animalTag: "A-2405",
    animalName: "Daisy",
    breedingDate: "2024-02-10",
    confirmationDate: "2024-03-12",
    expectedCalvingDate: "2024-11-18",
    daysPregnant: 39,
    trimester: 1,
    lastCheckup: "2024-03-12",
    status: "healthy",
  },
  {
    id: "P003",
    animalTag: "A-2398",
    animalName: "Clover",
    breedingDate: "2023-12-05",
    confirmationDate: "2024-01-05",
    expectedCalvingDate: "2024-09-12",
    daysPregnant: 106,
    trimester: 2,
    lastCheckup: "2024-03-15",
    status: "attention",
  },
];

const calvingEvents = [
  {
    id: "C001",
    animalTag: "A-2390",
    expectedDate: "2024-03-25",
    daysUntil: 5,
    status: "imminent",
  },
  {
    id: "C002",
    animalTag: "A-2392",
    expectedDate: "2024-03-28",
    daysUntil: 8,
    status: "upcoming",
  },
  {
    id: "C003",
    animalTag: "A-2395",
    expectedDate: "2024-04-05",
    daysUntil: 16,
    status: "upcoming",
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "confirmed":
    case "healthy":
      return "bg-green-500/10 text-green-600 dark:text-green-400";
    case "pending":
    case "upcoming":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "failed":
    case "critical":
      return "bg-red-500/10 text-red-600 dark:text-red-400";
    case "attention":
    case "imminent":
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
    default:
      return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "confirmed":
    case "healthy":
      return <CheckCircle className="w-3 h-3" />;
    case "pending":
    case "upcoming":
      return <Clock className="w-3 h-3" />;
    case "failed":
    case "critical":
    case "attention":
    case "imminent":
      return <AlertCircle className="w-3 h-3" />;
    default:
      return null;
  }
}

export default function Breeding() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>("all");

  const filteredRecords = mockBreedingRecords.filter((record) => {
    const matchesSearch =
      record.animalTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.animalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod =
      selectedMethod === "all" || record.method === selectedMethod;
    return matchesSearch && matchesMethod;
  });

  const stats = [
    {
      title: "Active Pregnancies",
      value: "28",
      change: "+3 this month",
      icon: Heart,
    },
    {
      title: "Breeding Success Rate",
      value: "79.2%",
      change: "+2.1% vs last quarter",
      icon: CheckCircle,
    },
    {
      title: "Upcoming Calvings",
      value: "12",
      change: "Next 30 days",
      icon: Calendar,
    },
    {
      title: "Heat Detection",
      value: "8",
      change: "Animals in heat",
      icon: AlertCircle,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            Breeding Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Track breeding cycles, artificial insemination, and calving records
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Record Breeding
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

      <Tabs defaultValue="breeding" className="space-y-6">
        <TabsList>
          <TabsTrigger value="breeding">Breeding Records</TabsTrigger>
          <TabsTrigger value="pregnancy">Pregnancy Tracking</TabsTrigger>
          <TabsTrigger value="calving">Calving Calendar</TabsTrigger>
        </TabsList>

        {/* Breeding Records Tab */}
        <TabsContent value="breeding">
          <Card>
            <CardHeader>
              <CardTitle>Breeding Records</CardTitle>
              <CardDescription>
                Track all breeding activities and insemination records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by tag or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="all">All Methods</option>
                  <option value="AI">Artificial Insemination</option>
                  <option value="Natural">Natural Breeding</option>
                </select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Animal</TableHead>
                      <TableHead>Breeding Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Bull ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expected Calving</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{record.animalTag}</p>
                            {/* <p className="text-sm text-muted-foreground">
                              {record.animalName}
                            </p> */}
                          </div>
                        </TableCell>
                        <TableCell>{record.breedingDate}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{record.method}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {record.bullId || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`gap-1 ${getStatusColor(record.status)}`}
                          >
                            {getStatusIcon(record.status)}
                            {record.status.charAt(0).toUpperCase() +
                              record.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {record.expectedCalvingDate || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pregnancy Tracking Tab */}
        <TabsContent value="pregnancy">
          <Card>
            <CardHeader>
              <CardTitle>Pregnancy Monitoring</CardTitle>
              <CardDescription>
                Monitor pregnant animals and track their progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPregnancyRecords.map((record) => (
                  <div key={record.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{record.animalTag}</p>
                          <Badge
                            variant="secondary"
                            className={`gap-1 ${getStatusColor(record.status)}`}
                          >
                            {getStatusIcon(record.status)}
                            {record.status.charAt(0).toUpperCase() +
                              record.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Trimester {record.trimester} • {record.daysPregnant}{" "}
                          days pregnant
                        </p>
                      </div>
                      <Badge variant="outline">
                        Expected: {record.expectedCalvingDate}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Pregnancy Progress
                        </span>
                        <span className="font-medium">
                          {Math.round((record.daysPregnant / 280) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={(record.daysPregnant / 280) * 100}
                        className="h-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Breeding Date</p>
                        <p className="font-medium">{record.breedingDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Checkup</p>
                        <p className="font-medium">{record.lastCheckup}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calving Calendar Tab */}
        <TabsContent value="calving">
          <Card>
            <CardHeader>
              <CardTitle>Calving Calendar</CardTitle>
              <CardDescription>
                Upcoming calving events and birth notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {calvingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-full ${getStatusColor(
                          event.status
                        )}`}
                      >
                        <Baby className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Expected calving date
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{event.expectedDate}</p>
                      <Badge
                        variant="secondary"
                        className={`gap-1 ${getStatusColor(event.status)}`}
                      >
                        {event.daysUntil} days
                      </Badge>
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
