import { useState } from "react";
import {
  Plus,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  Baby,
  Pencil,
  Trash2,
  Edit3,
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
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { AddBreedingModal } from "@/components/modals/AddBreedingModal";
import { AddPregnancyModal } from "@/components/modals/AddPregnancyModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddCalvingModal } from "@/components/modals/AddCalvingModal";

interface BreedingRecord {
  id: string;
  animalTag: string;
  animalName: string;
  breedingDate: string;
  method: "AI" | "NATURAL";
  bullId?: string;
  status: "PENDING" | "CONFIRMED" | "FAILED";
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
    method: "NATURAL",
    bullId: "BULL-789",
    status: "CONFIRMED",
    expectedCalvingDate: "2024-10-22",
    notes: "First insemination successful",
  },
  {
    id: "B002",
    animalTag: "A-2405",
    animalName: "Daisy",
    breedingDate: "2024-02-10",
    method: "NATURAL",
    bullId: "BULL-456",
    status: "CONFIRMED",
    expectedCalvingDate: "2024-11-18",
  },
  {
    id: "B003",
    animalTag: "A-2410",
    animalName: "Luna",
    breedingDate: "2024-03-05",
    method: "AI",
    status: "PENDING",
    notes: "Awaiting pregnancy confirmation",
  },
  {
    id: "B004",
    animalTag: "A-2415",
    animalName: "Rosie",
    breedingDate: "2024-02-20",
    method: "NATURAL",
    bullId: "BULL-789",
    status: "FAILED",
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
    expectedDate: "2024-11-13", // Today - Due now!
    daysUntil: 0,
    status: "imminent",
  },
  {
    id: "C002",
    animalTag: "A-2385",
    expectedDate: "2024-11-12", // Yesterday - Overdue
    daysUntil: -1,
    status: "imminent",
  },
  {
    id: "C003",
    animalTag: "A-2401",
    expectedDate: "2024-11-16",
    daysUntil: 3,
    status: "imminent",
  },
  {
    id: "C004",
    animalTag: "A-2392",
    expectedDate: "2024-11-18",
    daysUntil: 5,
    status: "imminent",
  },
  {
    id: "C005",
    animalTag: "A-2398",
    expectedDate: "2024-11-21",
    daysUntil: 8,
    status: "upcoming",
  },
  {
    id: "C006",
    animalTag: "A-2395",
    expectedDate: "2024-11-27",
    daysUntil: 14,
    status: "upcoming",
  },
  {
    id: "C007",
    animalTag: "A-2403",
    expectedDate: "2024-12-05",
    daysUntil: 22,
    status: "upcoming",
  },
  {
    id: "C008",
    animalTag: "A-2407",
    expectedDate: "2024-12-15",
    daysUntil: 32,
    status: "upcoming",
  },
];

const heatDetectionAnimals = [
  {
    id: "H001",
    tag: "A-2420",
    name: "Bella",
    heatDetected: "2024-03-18",
    daysInHeat: 1,
    lastBred: "2023-06-15",
    daysSinceBirth: 276,
  },
  {
    id: "H002",
    tag: "A-2418",
    name: "Molly",
    heatDetected: "2024-03-19",
    daysInHeat: 0,
    lastBred: "2023-07-20",
    daysSinceBirth: 240,
  },
  {
    id: "H003",
    tag: "A-2425",
    name: "Ginger",
    heatDetected: "2024-03-17",
    daysInHeat: 2,
    lastBred: "2023-05-10",
    daysSinceBirth: 312,
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "CONFIRMED":
    case "healthy":
      return "bg-green-500/10 text-green-600 dark:text-green-400";
    case "PENDING":
    case "upcoming":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "FAILED":
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
    case "CONFIRMED":
    case "healthy":
      return <CheckCircle className="w-3 h-3" />;
    case "PENDING":
    case "upcoming":
      return <Clock className="w-3 h-3" />;
    case "FAILED":
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
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addBreedingOpen, setAddBreedingOpen] = useState(false);
  const [editBreeding, setEditBreeding] = useState<BreedingRecord | null>(null);
  const [addPregnancyOpen, setAddPregnancyOpen] = useState(false);
  const [addCalvingOpen, setCalvingOpen] = useState(false);

  const filteredRecords = mockBreedingRecords.filter((record) => {
    const matchesSearch =
      record.animalTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.animalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || record.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      title: "In Heat",
      value: "8",
      change: "Ready for breeding",
    },
    {
      title: "Pending Checks",
      value: "12",
      change: "Due for confirmation",
    },
    {
      title: "Pregnancies",
      value: "28",
      change: "+3 this month",
    },
    {
      title: "Calvings",
      value: "5",
      change: "Next 30 days",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2">
            Breeding Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Track breeding cycles, artificial insemination, and calving records
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4">
          <Button
            className="gap-2 px-3 py-2 text-sm sm:text-base"
            onClick={() => setAddBreedingOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Record Heat
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="heat" className="space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide border-b rounded-none bg-transparent p-0">
          <TabsTrigger
            value="heat"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Heat Detection
          </TabsTrigger>
          <TabsTrigger
            value="breeding"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Breeding Records
          </TabsTrigger>
          <TabsTrigger
            value="pregnancy"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Pregnancy Tracking
          </TabsTrigger>
          <TabsTrigger
            value="calving"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Calving Calendar
          </TabsTrigger>
        </TabsList>

        {/* Heat Detection Tab */}
        <TabsContent value="heat">
          <Card>
            <CardHeader>
              <CardTitle>Heat Detection</CardTitle>
              <CardDescription>
                Animals currently in heat and ready for breeding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {heatDetectionAnimals.map((animal) => (
                  <div key={animal.id} className="p-3 sm:p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold">{animal.tag}</p>
                          <Badge
                            variant="secondary"
                            className="gap-1 bg-red-500/10 text-red-600 dark:text-red-400 text-xs"
                          >
                            <AlertCircle className="w-3 h-3" />
                            Day {animal.daysInHeat + 1}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setAddBreedingOpen(true)}
                        className="ml-2 shrink-0"
                      >
                        <Plus className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">
                          Breeding Record
                        </span>
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                      <div>
                        <p className="text-muted-foreground">Heat Detected</p>
                        <p className="font-medium">{animal.heatDetected}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Bred</p>
                        <p className="font-medium">{animal.lastBred}</p>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-muted-foreground">
                          Days Since Birth
                        </p>
                        <p className="font-medium">{animal.daysSinceBirth}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Breeding Records Tab */}
        <TabsContent value="breeding">
          <Card>
            <CardHeader>
              <CardTitle>Breeding Records</CardTitle>
              <CardDescription>
                All breeding attempts - pending pregnancy confirmation
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
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Animal Tag</TableHead>
                      <TableHead>Service Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Bull ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expected Calving</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{record.animalTag}</p>
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

                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Edit3 className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setEditBreeding(record)}
                              >
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit Record
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => setAddPregnancyOpen(true)}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Confirm Pregnancy
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setDeleteModalOpen(true)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Record
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                {calvingEvents.map((event) => {
                  const isDue = event.daysUntil <= 0;
                  const isImminent =
                    event.daysUntil > 0 && event.daysUntil <= 7;

                  return (
                    <div
                      key={event.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg"
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
                          <p className="font-medium">{event.animalTag}</p>
                          <p className="text-sm text-muted-foreground">
                            Expected calving date
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="text-left sm:text-right">
                          <p className="font-medium">{event.expectedDate}</p>
                          <Badge
                            variant="secondary"
                            className={`gap-1 ${getStatusColor(
                              event.status
                            )} inline-flex mt-1`}
                          >
                            {isDue
                              ? "Due Now"
                              : `${event.daysUntil} day${
                                  event.daysUntil !== 1 ? "s" : ""
                                }`}
                          </Badge>
                        </div>

                        {isDue && (
                          <Button
                            onClick={() => setCalvingOpen(true)}
                            size="sm"
                            className="w-full sm:w-auto"
                          >
                            Record Birth
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddBreedingModal
        open={addBreedingOpen}
        onOpenChange={setAddBreedingOpen}
      />

      <AddBreedingModal
        open={!!editBreeding}
        onOpenChange={(open) => !open && setEditBreeding(null)}
        breeding={editBreeding}
      />

      <AddPregnancyModal
        open={addPregnancyOpen}
        onOpenChange={setAddPregnancyOpen}
      />

      <AddCalvingModal open={addCalvingOpen} onOpenChange={setCalvingOpen} />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Health Record?"
        description="Are you sure you want to delete this health record? This action cannot be undone."
      />
    </div>
  );
}
