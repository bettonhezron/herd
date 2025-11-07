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
  X,
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

// Generate 100 mock heat detection records
const generateHeatDetectionAnimals = () => {
  const names = [
    "Bella",
    "Molly",
    "Ginger",
    "Daisy",
    "Luna",
    "Rosie",
    "Clover",
    "Bessie",
    "Pearl",
    "Ruby",
  ];
  const animals = [];
  for (let i = 1; i <= 100; i++) {
    animals.push({
      id: `H${String(i).padStart(3, "0")}`,
      tag: `A-${2400 + i}`,
      name: names[i % names.length] + (i > 10 ? ` ${Math.floor(i / 10)}` : ""),
      heatDetected: new Date(2024, 2, Math.floor(Math.random() * 20) + 1)
        .toISOString()
        .split("T")[0],
      daysInHeat: Math.floor(Math.random() * 3),
      lastBred: new Date(
        2023,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      )
        .toISOString()
        .split("T")[0],
      daysSinceBirth: Math.floor(Math.random() * 200) + 150,
    });
  }
  return animals;
};

// Generate 100 mock breeding records
const generateBreedingRecords = (): BreedingRecord[] => {
  const names = [
    "Bessie",
    "Daisy",
    "Luna",
    "Rosie",
    "Clover",
    "Pearl",
    "Ruby",
    "Misty",
    "Shadow",
    "Star",
  ];
  const methods: ("AI" | "NATURAL")[] = ["AI", "NATURAL"];
  const statuses: ("PENDING" | "CONFIRMED" | "FAILED")[] = [
    "PENDING",
    "CONFIRMED",
    "FAILED",
  ];
  const records = [];

  for (let i = 1; i <= 100; i++) {
    const method = methods[Math.floor(Math.random() * methods.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const breedingDate = new Date(
      2024,
      Math.floor(Math.random() * 3),
      Math.floor(Math.random() * 28) + 1
    )
      .toISOString()
      .split("T")[0];

    records.push({
      id: `B${String(i).padStart(3, "0")}`,
      animalTag: `A-${2300 + i}`,
      animalName:
        names[i % names.length] + (i > 10 ? ` ${Math.floor(i / 10)}` : ""),
      breedingDate,
      method,
      bullId:
        method === "NATURAL"
          ? `BULL-${Math.floor(Math.random() * 900) + 100}`
          : undefined,
      status,
      expectedCalvingDate:
        status !== "FAILED"
          ? new Date(
              new Date(breedingDate).getTime() + 280 * 24 * 60 * 60 * 1000
            )
              .toISOString()
              .split("T")[0]
          : undefined,
      notes:
        status === "PENDING"
          ? "Awaiting pregnancy confirmation"
          : status === "FAILED"
          ? "Did not conceive"
          : "Confirmed pregnant",
    });
  }
  return records;
};

// Generate 100 mock pregnancy records
const generatePregnancyRecords = (): PregnancyRecord[] => {
  const names = [
    "Bessie",
    "Daisy",
    "Clover",
    "Pearl",
    "Ruby",
    "Luna",
    "Rosie",
    "Misty",
    "Shadow",
    "Star",
  ];
  const statuses: ("healthy" | "attention" | "critical")[] = [
    "healthy",
    "healthy",
    "healthy",
    "attention",
    "healthy",
  ];
  const records = [];

  for (let i = 1; i <= 100; i++) {
    const daysPregnant = Math.floor(Math.random() * 250) + 30;
    const trimester = daysPregnant < 93 ? 1 : daysPregnant < 186 ? 2 : 3;
    const breedingDate = new Date(
      Date.now() - daysPregnant * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];

    records.push({
      id: `P${String(i).padStart(3, "0")}`,
      animalTag: `A-${2200 + i}`,
      animalName:
        names[i % names.length] + (i > 10 ? ` ${Math.floor(i / 10)}` : ""),
      breedingDate,
      confirmationDate: new Date(
        new Date(breedingDate).getTime() + 30 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      expectedCalvingDate: new Date(
        new Date(breedingDate).getTime() + 280 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      daysPregnant,
      trimester,
      lastCheckup: new Date(
        Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }
  return records;
};

// Generate 100 mock calving events
const generateCalvingEvents = () => {
  const events = [];
  for (let i = 1; i <= 100; i++) {
    const daysUntil = Math.floor(Math.random() * 60);
    events.push({
      id: `C${String(i).padStart(3, "0")}`,
      animalTag: `A-${2100 + i}`,
      expectedDate: new Date(Date.now() + daysUntil * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      daysUntil,
      status: daysUntil < 7 ? "imminent" : "upcoming",
    });
  }
  return events.sort((a, b) => a.daysUntil - b.daysUntil);
};

const heatDetectionAnimals = generateHeatDetectionAnimals();
const mockBreedingRecords = generateBreedingRecords();
const mockPregnancyRecords = generatePregnancyRecords();
const calvingEvents = generateCalvingEvents();

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
  const [selectedMethod, setSelectedMethod] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addBreedingOpen, setAddBreedingOpen] = useState(false);
  const [editBreeding, setEditBreeding] = useState<BreedingRecord | null>(null);
  const [addPregnancyOpen, setAddPregnancyOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BreedingRecord | null>(
    null
  );

  const filteredHeatAnimals = heatDetectionAnimals.filter(
    (animal) =>
      animal.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBreedingRecords = mockBreedingRecords.filter((record) => {
    const matchesSearch =
      record.animalTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.animalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod =
      selectedMethod === "all" || record.method === selectedMethod;
    const matchesStatus =
      selectedStatus === "all" || record.status === selectedStatus;
    return matchesSearch && matchesMethod && matchesStatus;
  });

  const filteredPregnancyRecords = mockPregnancyRecords.filter(
    (record) =>
      record.animalTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.animalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCalvingEvents = calvingEvents.filter((event) =>
    event.animalTag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    {
      title: "Animals in Heat",
      value: heatDetectionAnimals.length.toString(),
      change: "Ready for breeding",
    },
    {
      title: "Pending Pregnancy Check",
      value: mockBreedingRecords
        .filter((r) => r.status === "PENDING")
        .length.toString(),
      change: "Due for confirmation",
    },
    {
      title: "Active Pregnancies",
      value: mockPregnancyRecords.length.toString(),
      change: "+3 this month",
    },
    {
      title: "Upcoming Calvings",
      value: calvingEvents.filter((e) => e.daysUntil <= 30).length.toString(),
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
            Record Breeding
          </Button>

          <Button
            className="gap-2 px-3 py-2 text-sm sm:text-base"
            variant="outline"
            onClick={() => setAddPregnancyOpen(true)}
          >
            Confirm Pregnancy
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="heat" className="space-y-6">
        <TabsList>
          <TabsTrigger value="heat">Heat Detection</TabsTrigger>
          <TabsTrigger value="breeding">Breeding Records</TabsTrigger>
          <TabsTrigger value="pregnancy">Pregnancy Tracking</TabsTrigger>
          <TabsTrigger value="calving">Calving Calendar</TabsTrigger>
        </TabsList>

        {/* Heat Detection Tab */}
        <TabsContent value="heat">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Heat Detection</CardTitle>
                  <CardDescription>
                    Animals currently in heat and ready for breeding
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-lg">
                  {filteredHeatAnimals.length} animals
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by tag or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredHeatAnimals.map((animal) => (
                  <div key={animal.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{animal.tag}</p>
                          <Badge
                            variant="secondary"
                            className="gap-1 bg-red-500/10 text-red-600 dark:text-red-400"
                          >
                            <AlertCircle className="w-3 h-3" />
                            In Heat - Day {animal.daysInHeat + 1}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {animal.name}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setAddBreedingOpen(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Record Breeding
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Heat Detected</p>
                        <p className="font-medium">{animal.heatDetected}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Bred</p>
                        <p className="font-medium">{animal.lastBred}</p>
                      </div>
                      <div>
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Breeding Records</CardTitle>
                  <CardDescription>
                    All breeding attempts - pending pregnancy confirmation
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-lg">
                  {filteredBreedingRecords.length} records
                </Badge>
              </div>
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
                  <option value="NATURAL">Natural Breeding</option>
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>

              <div className="rounded-md border max-h-[600px] overflow-auto">
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
                    {filteredBreedingRecords.map((record) => (
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
                              record.status.slice(1).toLowerCase()}
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
                              {record.status === "PENDING" && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedRecord(record);
                                    setAddPregnancyOpen(true);
                                  }}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Confirm Pregnancy
                                </DropdownMenuItem>
                              )}
                              {record.status === "PENDING" && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    // Handle mark as failed
                                  }}
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Mark as Failed
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => setEditBreeding(record)}
                              >
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit Record
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pregnancy Monitoring</CardTitle>
                  <CardDescription>
                    Monitor pregnant animals and track their progress
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-lg">
                  {filteredPregnancyRecords.length} pregnancies
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by tag or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredPregnancyRecords.map((record) => (
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Calving Calendar</CardTitle>
                  <CardDescription>
                    Upcoming calving events and birth notifications
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-lg">
                  {filteredCalvingEvents.length} events
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredCalvingEvents.map((event) => (
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
                        <p className="font-medium">{event.animalTag}</p>
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
        breedingRecord={selectedRecord}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Breeding Record?"
        description="Are you sure you want to delete this breeding record? This action cannot be undone."
      />
    </div>
  );
}
